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
      windowsOption: data.windowsOption || WindowsOption.NONE,
      priorityType: data.priorityType || PriorityType.PERFORMANCE,
      subtotalPartsPrice: subtotal,
      assemblyFee: 50000,
      shippingFee: 10000,
      windowsFee: data.windowsOption === WindowsOption.LICENSE_AND_INSTALL ? 180000 : 0,
      totalPrice: subtotal + 50000 + 10000 + (data.windowsOption === WindowsOption.LICENSE_AND_INSTALL ? 180000 : 0),
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
