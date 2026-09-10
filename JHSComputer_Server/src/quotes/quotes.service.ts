import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'node:crypto';
import { Quote } from './quote.entity';
import { QuoteItem } from './quote-item.entity';
import { QuoteTemplate } from './quote-template.entity';
import { Part } from '../parts/part.entity';
import { PartCategory } from '../parts/part-category.entity';
import { User } from '../users/user.entity';
import { Order } from '../orders/order.entity';
import { OrderItem } from '../orders/order-item.entity';
import { Payment } from '../orders/payment.entity';
import { OrderStatusHistory } from '../orders/order-status-history.entity';
import { SupplierOffer } from '../parts/supplier-offer.entity';
import { SupplierProduct } from '../parts/supplier-product.entity';
import { SaveQuoteSnapshotDto } from './dto/quote.dto';
import {
  BudgetScope,
  OrderStatus,
  PriorityType,
  Purpose,
  QuoteStatus,
  Resolution,
  PaymentMethod,
  PaymentStatus,
  UserRole,
  UserStatus,
  WindowsOption,
} from '../common/enums';

@Injectable()
export class QuotesService {
  constructor(
    @InjectRepository(Quote)
    private quoteRepository: Repository<Quote>,
    @InjectRepository(QuoteItem)
    private quoteItemRepository: Repository<QuoteItem>,
    @InjectRepository(QuoteTemplate)
    private templateRepository: Repository<QuoteTemplate>,
    @InjectRepository(Part)
    private partRepository: Repository<Part>,
    @InjectRepository(PartCategory)
    private categoryRepository: Repository<PartCategory>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(SupplierOffer)
    private supplierOfferRepository: Repository<SupplierOffer>,
    @InjectRepository(SupplierProduct)
    private supplierProductRepository: Repository<SupplierProduct>,
  ) {}

  async getTemplates() {
    return this.templateRepository.find({
      where: { isActive: true },
    });
  }

  async getQuotes(params: { userId: string; page: number; limit: number }) {
    const { page, limit } = normalizePagination(params.page, params.limit);
    const { userId } = params;
    const query = this.quoteRepository.createQueryBuilder('quote')
      .leftJoinAndSelect('quote.template', 'template')
      .where('quote.userId = :userId', { userId });

    const [items, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('quote.createdAt', 'DESC')
      .getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getQuoteDetail(id: number, userId: string, role: string) {
    const quote = await this.quoteRepository.findOne({
      where: { id: id.toString() },
      relations: ['template', 'items', 'items.part', 'items.category', 'items.supplierOffer', 'items.supplierOffer.product'],
    });

    if (!quote) {
      throw new NotFoundException('Quote not found');
    }

    if (role !== UserRole.ADMIN && quote.userId !== userId) {
      throw new NotFoundException('Quote not found');
    }

    const { user: _user, ...safeQuote } = quote as Quote & { user?: unknown };
    return safeQuote;
  }

  async createQuote(userId: string, data: SaveQuoteSnapshotDto) {
    return this.saveQuoteSnapshot(userId, data);
  }

  async saveQuoteSnapshot(userId: string, snapshot: SaveQuoteSnapshotDto) {
    const input = snapshot.input ?? {};
    const normalizedPurpose = normalizePurpose(input.purpose ?? snapshot.purpose);
    const normalizedResolution = normalizeResolution(input.resolution);
    const windowsOption = normalizeWindowsOption(typeof input.windows === 'string' ? input.windows : undefined);
    const budgetInput = Number(snapshot.budget ?? input.budget ?? getProfileTargetBudget(snapshot.profile) / 10_000);
    if (!Number.isFinite(budgetInput) || budgetInput < 0 || budgetInput > 100_000) {
      throw new BadRequestException('예산 값이 올바르지 않습니다.');
    }

    return this.quoteRepository.manager.transaction(async (manager) => {
      const resolved = await this.resolveSnapshotParts(manager, snapshot.parts);
      const subtotal = resolved.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const includes = getBudgetIncludes(snapshot.profile);
      const assemblyFee = includes
        ? includes.includes('ASSEMBLY') ? (normalizedPurpose === Purpose.OFFICE ? 30_000 : 50_000) : 0
        : (normalizedPurpose === Purpose.OFFICE ? 30_000 : 50_000);
      const shippingFee = includes ? includes.includes('SHIPPING') ? 10_000 : 0 : 10_000;
      const windowsFee = includes && !includes.includes('WINDOWS') ? 0 : getWindowsFee(windowsOption);
      const totalPrice = subtotal + assemblyFee + shippingFee + windowsFee;
      const targetGames = Array.isArray(input.games)
        ? input.games.filter((game): game is string => typeof game === 'string').slice(0, 3)
        : null;
      const quoteRepository = manager.getRepository(Quote);
      const saved = await quoteRepository.save(quoteRepository.create({
        userId,
        status: QuoteStatus.DRAFT,
        budgetAmount: Math.round(budgetInput * 10_000),
        budgetScope: BudgetScope.BODY_ONLY,
        purpose: normalizedPurpose,
        resolution: normalizedResolution,
        storagePreference: typeof input.storage === 'string' ? input.storage : null,
        targetGamesJson: targetGames,
        windowsOption,
        priorityType: normalizePriority(input.priority),
        subtotalPartsPrice: subtotal,
        assemblyFee,
        windowsFee,
        shippingFee,
        totalPrice,
        snapshotJson: {
          title: snapshot.title ?? 'JHS PC 견적',
          input,
          profile: snapshot.profile ?? null,
          preview: snapshot.preview ?? null,
          compatibility: snapshot.compatibility ?? [],
          performance: snapshot.performance ?? [],
          subtotal,
          assemblyFee,
          shippingFee,
          windowsFee,
          total: totalPrice,
          parts: resolved.map((item) => ({
            category: item.category,
            name: item.part.canonicalName,
            productNo: item.offer.product?.externalProductId,
            offerId: item.offer.id,
            externalOfferId: item.offer.externalOfferId,
            offerName: item.offer.offerName,
            supplier: item.offer.product?.supplier?.supplierCode ?? null,
            stockStatus: item.offer.currentStockStatus,
            priceCheckedAt: item.offer.currentPriceDt,
            publicPrice: item.offer.currentPublicPrice,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      }));

      const itemRepository = manager.getRepository(QuoteItem);
      await itemRepository.save(resolved.map((item, index) => itemRepository.create({
        quoteId: saved.id,
        partCategoryId: item.part.categoryId,
        partId: item.part.id,
        supplierOfferId: item.offer.id,
        quantity: item.quantity,
        currentPublicPrice: item.price,
        sortOrder: index,
      })));

      return { quoteId: saved.id, subtotalPartsPrice: subtotal, totalPrice };
    });
  }

  async getMyQuotes(userId: string, page = 1, limit = 20) {
    ({ page, limit } = normalizePagination(page, limit));
    const [items, total] = await this.quoteRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async convertToOrder(quoteId: number, data: { recipientName: string; recipientPhone: string; postalCode: string; address1: string; address2?: string; deliveryMemo?: string }, userId: string, role: string) {
    const quote = await this.quoteRepository.findOne({
      where: { id: quoteId.toString() },
      relations: ['items', 'items.category', 'items.part', 'items.supplierOffer', 'items.supplierOffer.product', 'items.supplierOffer.product.supplier'],
    });

    if (!quote) throw new NotFoundException('Quote not found');
    if (role !== UserRole.ADMIN && quote.userId !== userId) throw new NotFoundException('Quote not found');
    if (![QuoteStatus.DRAFT, QuoteStatus.ACTIVE, QuoteStatus.PRICE_CHANGED].includes(quote.status)) {
      throw new ConflictException('이미 주문 처리된 견적입니다.');
    }
    if (!quote.items?.length) throw new ConflictException('주문 가능한 부품이 없는 견적입니다.');

    const staleItems = quote.items.filter((item) => {
      const offer = item.supplierOffer;
      const currentPrice = offer?.currentBenefitPrice ?? offer?.currentPublicPrice ?? 0;
      return !offer || !offer.isActive || !['AVAILABLE', 'IN_STOCK', 'LOW_STOCK'].includes(String(offer.currentStockStatus)) || currentPrice !== item.currentPublicPrice;
    });
    if (staleItems.length) {
      quote.status = QuoteStatus.PRICE_CHANGED;
      await this.quoteRepository.save(quote);
      throw new ConflictException({
        code: 'PRICE_APPROVAL_REQUIRED',
        quoteId: quote.id,
        message: '가격 또는 재고가 변경된 부품이 있습니다. 변경 내용을 확인한 뒤 다시 주문해주세요.',
        changes: staleItems.map((item) => {
          const currentPrice = item.supplierOffer?.currentBenefitPrice ?? item.supplierOffer?.currentPublicPrice ?? 0;
          const snapshotPart = Array.isArray(quote.snapshotJson?.parts)
            ? quote.snapshotJson.parts.find((part: { offerId?: string }) => String(part.offerId ?? '') === String(item.supplierOfferId))
            : undefined;
          return {
            partName: item.part?.canonicalName ?? snapshotPart?.name ?? '부품 정보 없음',
            offerId: item.supplierOfferId,
            previousPrice: item.currentPublicPrice,
            currentPrice,
            previousStockStatus: snapshotPart?.stockStatus ?? null,
            currentStockStatus: item.supplierOffer?.currentStockStatus ?? null,
            priceChanged: currentPrice !== item.currentPublicPrice,
            stockChanged: !item.supplierOffer || !item.supplierOffer.isActive || !['AVAILABLE', 'IN_STOCK', 'LOW_STOCK'].includes(String(item.supplierOffer.currentStockStatus)),
          };
        }),
      });
    }

    const orderNo = `JHS-${randomBytes(12).toString('hex').toUpperCase()}`;
    const savedOrder = await this.orderRepository.manager.transaction(async (manager) => {
      const orderRepository = manager.getRepository(Order);
      const order = await orderRepository.save(orderRepository.create({
        orderNo,
        userId: quote.userId,
        quoteId: quote.id,
        status: OrderStatus.WAITING_DEPOSIT,
        recipientName: data.recipientName,
        recipientPhone: data.recipientPhone,
        postalCode: data.postalCode,
        address1: data.address1,
        address2: data.address2 ?? null,
        deliveryMemo: data.deliveryMemo ?? null,
        subtotalPartsPrice: quote.subtotalPartsPrice,
        assemblyFee: quote.assemblyFee,
        windowsFee: quote.windowsFee,
        shippingFee: quote.shippingFee,
        totalPrice: quote.totalPrice,
      }));

      const itemRepository = manager.getRepository(OrderItem);
      await itemRepository.save(quote.items.map((item) => itemRepository.create({
        orderId: order.id,
        categoryCode: item.category.code,
        partId: item.partId,
        supplierOfferId: item.supplierOfferId,
        partNameSnapshot: item.part?.canonicalName ?? '부품 정보 없음',
        supplierCodeSnapshot: item.supplierOffer?.product?.supplier?.supplierCode ?? null,
        externalOfferIdSnapshot: item.supplierOffer?.externalOfferId ?? null,
        offerNameSnapshot: item.supplierOffer?.offerName ?? null,
        productUrlSnapshot: item.supplierOffer?.product?.productUrl ?? null,
        quantity: item.quantity,
        publicPrice: item.currentPublicPrice,
        totalPublicPrice: item.currentPublicPrice * item.quantity,
      })));

      const paymentRepository = manager.getRepository(Payment);
      await paymentRepository.save(paymentRepository.create({
        orderId: order.id,
        amount: order.totalPrice,
        status: PaymentStatus.PENDING,
        method: PaymentMethod.BANK_TRANSFER,
      }));

      const historyRepository = manager.getRepository(OrderStatusHistory);
      await historyRepository.save(historyRepository.create({
        orderId: order.id,
        fromStatus: null,
        toStatus: OrderStatus.WAITING_DEPOSIT,
        actorUserId: userId,
        memo: '주문이 접수되었습니다. 안내된 계좌로 입금해주시면 확인 후 조립을 시작합니다.',
      }));

      quote.status = QuoteStatus.ORDERED;
      await manager.getRepository(Quote).save(quote);
      return order;
    });

    return { orderId: savedOrder.id, orderNo: savedOrder.orderNo };
  }

  private async resolveSnapshotParts(manager: import('typeorm').EntityManager, parts: SaveQuoteSnapshotDto['parts']) {
    const productNos = [...new Set(parts.map((part) => part.productNo).filter((value): value is string => Boolean(value)))];
    if (productNos.length !== parts.length) throw new BadRequestException('모든 견적 부품에 상품 식별자가 필요합니다.');

    const offers = await manager.getRepository(SupplierOffer)
      .createQueryBuilder('offer')
      .leftJoinAndSelect('offer.product', 'product')
      .leftJoinAndSelect('offer.part', 'part')
      .leftJoinAndSelect('part.category', 'category')
      .where('product.externalProductId IN (:...productNos)', { productNos })
      .andWhere('product.isActive = :productActive', { productActive: 'Y' })
      .andWhere('offer.isActive = :offerActive', { offerActive: 'Y' })
      .andWhere('offer.partId IS NOT NULL')
      .andWhere('offer.currentPriceDt IS NOT NULL')
      .andWhere('offer.currentStockStatus IN (:...stockStatuses)', { stockStatuses: ['AVAILABLE', 'IN_STOCK', 'LOW_STOCK'] })
      .orderBy('offer.isDefault', 'DESC')
      .addOrderBy('offer.currentBenefitPrice', 'ASC')
      .getMany();

    const byProductNo = new Map<string, SupplierOffer>();
    const byOfferId = new Map<string, SupplierOffer>();
    for (const offer of offers) {
      byOfferId.set(String(offer.id), offer);
      const productNo = offer.product?.externalProductId;
      if (productNo && !byProductNo.has(productNo)) byProductNo.set(productNo, offer);
    }

    return parts.map((part) => {
      const offer = (part.offerId ? byOfferId.get(String(part.offerId)) : undefined) ?? byProductNo.get(part.productNo!);
      if (!offer?.part || !offer.product) throw new ConflictException(`판매 가능한 상품을 찾을 수 없습니다: ${part.name}`);
      if (part.offerId && String(offer.id) !== String(part.offerId)) throw new ConflictException(`선택한 판매 단위를 찾을 수 없습니다: ${part.name}`);
      const expectedCategory = normalizeCategory(part.category);
      if (expectedCategory && offer.part.category.code !== expectedCategory) {
        throw new BadRequestException(`견적 부품 카테고리가 일치하지 않습니다: ${part.name}`);
      }
      const price = offer.currentBenefitPrice ?? offer.currentPublicPrice;
      if (!price || price < 0) throw new ConflictException(`가격을 확인할 수 없는 상품입니다: ${part.name}`);
      return { offer, part: offer.part, category: offer.part.category.code, quantity: part.quantity, price };
    });
  }
}

function normalizeWindowsOption(value?: string | null) {
  if (value === WindowsOption.WINDOWS_11_HOME_FPP || value === WindowsOption.WINDOWS_11_PRO_FPP) return value;
  if (value === WindowsOption.INSTALL_ONLY || value === '설치만') return WindowsOption.INSTALL_ONLY;
  if (value === WindowsOption.LICENSE_AND_INSTALL || value === '포함') return WindowsOption.WINDOWS_11_HOME_FPP;
  return WindowsOption.NONE;
}

function getWindowsFee(value?: string | null) {
  const normalizedValue = normalizeWindowsOption(value);
  if (normalizedValue === WindowsOption.WINDOWS_11_HOME_FPP) return 205000;
  if (normalizedValue === WindowsOption.WINDOWS_11_PRO_FPP) return 324600;
  if (normalizedValue === WindowsOption.INSTALL_ONLY) return 30000;
  return 0;
}

function getBudgetIncludes(profile: unknown): string[] | undefined {
  if (!profile || typeof profile !== 'object') return undefined;
  const budgetProfile = (profile as { budgetProfile?: unknown }).budgetProfile;
  if (!budgetProfile || typeof budgetProfile !== 'object') return undefined;
  const includes = (budgetProfile as { includes?: unknown }).includes;
  return Array.isArray(includes) && includes.every((item) => typeof item === 'string') ? includes : undefined;
}

function getProfileTargetBudget(profile: unknown) {
  if (!profile || typeof profile !== 'object') return 0;
  const budgetProfile = (profile as { budgetProfile?: unknown }).budgetProfile;
  if (!budgetProfile || typeof budgetProfile !== 'object') return 0;
  const targetWon = (budgetProfile as { targetWon?: unknown }).targetWon;
  return typeof targetWon === 'number' && Number.isFinite(targetWon) ? targetWon : 0;
}

function normalizePagination(page: number, limit: number) {
  return {
    page: Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1,
    limit: Number.isFinite(limit) ? Math.min(100, Math.max(1, Math.floor(limit))) : 20,
  };
}

function normalizePurpose(value?: unknown) {
  const map: Record<string, Purpose> = {
    게임: Purpose.GAME,
    방송: Purpose.STREAMING,
    영상편집: Purpose.VIDEO_EDITING,
    사무: Purpose.OFFICE,
    AI: Purpose.AI,
  };
  return map[String(value ?? '')] ?? (Object.values(Purpose).includes(value as Purpose) ? value as Purpose : Purpose.GAME);
}

function normalizeResolution(value?: unknown) {
  if (value === 'FHD') return Resolution.FHD;
  if (value === 'QHD') return Resolution.QHD;
  if (value === '4K' || value === 'UHD_4K') return Resolution.UHD_4K;
  return Resolution.QHD;
}

function normalizePriority(value?: unknown) {
  const map: Record<string, PriorityType> = {
    '성능 우선': PriorityType.PERFORMANCE,
    '가성비 우선': PriorityType.VALUE,
    '감성 우선': PriorityType.DESIGN,
    '업그레이드 우선': PriorityType.UPGRADE,
  };
  return map[String(value ?? '')] ?? (Object.values(PriorityType).includes(value as PriorityType) ? value as PriorityType : PriorityType.VALUE);
}

function normalizeCategory(value: string) {
  const map: Record<string, string> = {
    CPU: 'CPU',
    쿨러: 'CPU_COOLER',
    CPU_COOLER: 'CPU_COOLER',
    메인보드: 'MAINBOARD',
    MAINBOARD: 'MAINBOARD',
    RAM: 'RAM',
    그래픽카드: 'GPU',
    GPU: 'GPU',
    SSD: 'SSD',
    파워: 'PSU',
    PSU: 'PSU',
    케이스: 'CASE',
    CASE: 'CASE',
  };
  return map[value] ?? value;
}
