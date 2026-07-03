import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quote } from './quote.entity';
import { QuoteItem } from './quote-item.entity';
import { QuoteTemplate } from './quote-template.entity';
import { Part } from '../parts/part.entity';
import { PartCategory } from '../parts/part-category.entity';
import { User } from '../users/user.entity';
import { Order } from '../orders/order.entity';
import { OrderItem } from '../orders/order-item.entity';
import {
  BudgetScope,
  OrderStatus,
  PriorityType,
  Purpose,
  QuoteStatus,
  Resolution,
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
  ) {}

  async getTemplates() {
    return this.templateRepository.find({
      where: { isActive: true },
    });
  }

  async getQuotes(params: { userId?: number; page: number; limit: number }) {
    const { userId, page, limit } = params;
    const query = this.quoteRepository.createQueryBuilder('quote')
      .leftJoinAndSelect('quote.user', 'user')
      .leftJoinAndSelect('quote.template', 'template');

    if (userId) {
      query.andWhere('quote.userId = :userId', { userId: userId.toString() });
    }

    const [items, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('quote.createdDt', 'DESC')
      .getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getQuoteDetail(id: number) {
    const quote = await this.quoteRepository.findOne({
      where: { id: id.toString() },
      relations: ['user', 'template', 'items', 'items.part', 'items.category', 'items.supplierOffer'],
    });

    if (!quote) {
      throw new NotFoundException('Quote not found');
    }

    return quote;
  }

  async createQuote(data: any) {
    const quote = this.quoteRepository.create(data);
    return this.quoteRepository.save(quote);
  }

  async saveQuoteSnapshot(userId: string, snapshot: {
    title?: string;
    purpose?: string;
    budget?: number;
    subtotal?: number;
    assemblyFee?: number;
    shippingFee?: number;
    windowsFee?: number;
    total?: number;
    parts?: any[];
    input?: any;
    compatibility?: string[];
  }) {
    const quoteData = {
      userId,
      status: QuoteStatus.DRAFT,
      budgetAmount: snapshot.budget ?? snapshot.input?.budget ?? 0,
      budgetScope: BudgetScope.BODY_ONLY,
      purpose: (snapshot.purpose ?? snapshot.input?.purpose ?? Purpose.GAME) as Purpose,
      resolution: (snapshot.input?.resolution ?? null) as Resolution | null,
      targetGamesJson: snapshot.input?.games ?? null,
      windowsOption: normalizeWindowsOption(snapshot.input?.windows),
      priorityType: PriorityType.VALUE,
      subtotalPartsPrice: snapshot.subtotal ?? 0,
      assemblyFee: snapshot.assemblyFee ?? 50000,
      windowsFee: snapshot.windowsFee ?? 0,
      shippingFee: snapshot.shippingFee ?? 10000,
      totalPrice: snapshot.total ?? 0,
      snapshotJson: snapshot,
    };
    const quote = this.quoteRepository.create(quoteData as Partial<Quote>);

    const saved = await this.quoteRepository.save(quote);
    return { quoteId: saved.id };
  }

  async getMyQuotes(userId: string, page = 1, limit = 20) {
    const [items, total] = await this.quoteRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async estimateQuote(data: any) {
    let user = await this.userRepository.findOne({ order: { id: 'ASC' } });
    if (!user) {
      user = this.userRepository.create({ name: 'Guest', role: UserRole.USER, status: UserStatus.ACTIVE });
      user = await this.userRepository.save(user);
    }

    const categories = await this.categoryRepository.find({ where: { isActive: true }, order: { sortOrder: 'ASC' } });
    
    let subtotal = 0;
    const itemsData = [];
    
    for (const category of categories) {
      const topPart = await this.partRepository.findOne({
        where: { categoryId: category.id, status: 'ACTIVE' as any },
        order: { popularityScore: 'DESC' },
      });

      if (topPart) {
        // dummy price for MVP
        const currentPublicPrice = 100000;
        subtotal += currentPublicPrice;
        itemsData.push({
          partCategoryId: category.id,
          partId: topPart.id,
          quantity: 1,
          currentPublicPrice: currentPublicPrice,
          sortOrder: category.sortOrder,
        });
      }
    }

    const quote = this.quoteRepository.create({
      userId: user.id,
      status: QuoteStatus.DRAFT,
      budgetAmount: data.budgetAmount || 150,
      budgetScope: data.budgetScope || BudgetScope.BODY_ONLY,
      purpose: data.purpose || Purpose.GAME,
      resolution: data.resolution || Resolution.QHD,
      targetGamesJson: data.games || null,
      windowsOption: normalizeWindowsOption(data.windowsOption),
      priorityType: data.priorityType || PriorityType.PERFORMANCE,
      subtotalPartsPrice: subtotal,
      assemblyFee: 50000,
      shippingFee: 10000,
      windowsFee: getWindowsFee(data.windowsOption),
      totalPrice: subtotal + 50000 + 10000 + getWindowsFee(data.windowsOption),
    });

    const savedQuote = await this.quoteRepository.save(quote);

    for (const itemData of itemsData) {
      const item = this.quoteItemRepository.create({
        quoteId: savedQuote.id,
        ...itemData,
      });
      await this.quoteItemRepository.save(item);
    }

    return { quoteId: savedQuote.id };
  }

  async convertToOrder(quoteId: number, data: any) {
    const quote = await this.quoteRepository.findOne({
      where: { id: quoteId.toString() },
      relations: ['items', 'items.category', 'items.part'],
    });

    if (!quote) throw new NotFoundException('Quote not found');

    const orderNo = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const order = this.orderRepository.create({
      orderNo,
      userId: quote.userId,
      quoteId: quote.id,
      status: OrderStatus.WAITING_DEPOSIT,
      recipientName: data.recipientName || '고객님',
      recipientPhone: data.recipientPhone || '010-0000-0000',
      postalCode: data.postalCode || '00000',
      address1: data.address1 || '주소 미입력',
      address2: data.address2 || '',
      deliveryMemo: data.deliveryMemo || '',
      subtotalPartsPrice: quote.subtotalPartsPrice,
      assemblyFee: quote.assemblyFee,
      windowsFee: quote.windowsFee,
      shippingFee: quote.shippingFee,
      totalPrice: quote.totalPrice,
    });

    const savedOrder = await this.orderRepository.save(order);

    for (const item of quote.items) {
      const orderItem = this.orderItemRepository.create({
        orderId: savedOrder.id,
        categoryCode: item.category.code,
        partId: item.partId,
        partNameSnapshot: item.part ? item.part.canonicalName : '부품 정보 없음',
        quantity: item.quantity,
        publicPrice: item.currentPublicPrice,
        totalPublicPrice: item.currentPublicPrice * item.quantity,
      });
      await this.orderItemRepository.save(orderItem);
    }

    quote.status = QuoteStatus.ORDERED;
    await this.quoteRepository.save(quote);

    return { orderId: savedOrder.id, orderNo: savedOrder.orderNo };
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
