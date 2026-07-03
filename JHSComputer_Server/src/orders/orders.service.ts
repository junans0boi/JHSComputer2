import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatus } from '../common/enums';
import { OrderStatusHistory } from './order-status-history.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(OrderStatusHistory)
    private historyRepository: Repository<OrderStatusHistory>,
  ) {}

  async getOrders(params: { userId?: number; page: number; limit: number }) {
    const { userId, page, limit } = params;
    const query = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('order.statusHistories', 'statusHistories');

    if (userId) {
      query.andWhere('order.userId = :userId', { userId: userId.toString() });
    }

    const [items, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('order.createdAt', 'DESC')
      .getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getOrderDetail(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id: id.toString() },
      relations: ['user', 'items', 'payments', 'statusHistories'],
    });

    if (!order) {
      throw new NotFoundException('주문을 찾을 수 없습니다.');
    }

    return order;
  }

  async getOrderByNo(orderNo: string) {
    const order = await this.orderRepository.findOne({
      where: { orderNo },
      relations: ['user', 'items', 'statusHistories'],
    });

    if (!order) {
      throw new NotFoundException('주문번호로 조회된 주문이 없습니다.');
    }

    return order;
  }

  async updateOrderStatus(id: number, status: string, memo?: string) {
    const order = await this.orderRepository.findOne({ where: { id: id.toString() } });
    if (!order) throw new NotFoundException('주문을 찾을 수 없습니다.');

    const prevStatus = order.status;
    order.status = status as OrderStatus;
    await this.orderRepository.save(order);

    const history = this.historyRepository.create({
      orderId: order.id,
      fromStatus: prevStatus,
      toStatus: status,
      memo: memo ?? null,
    });
    await this.historyRepository.save(history);

    return order;
  }

  async syncOrder(data: {
    orderNo: string;
    userId: string;
    quoteId?: string;
    recipientName: string;
    recipientPhone: string;
    postalCode: string;
    address1: string;
    address2?: string;
    deliveryMemo?: string;
    subtotalPartsPrice: number;
    assemblyFee: number;
    windowsFee: number;
    shippingFee: number;
    totalPrice: number;
    parts: Array<{
      categoryCode: string;
      partName: string;
      quantity: number;
      price: number;
    }>;
  }) {
    const existing = await this.orderRepository.findOne({ where: { orderNo: data.orderNo } });
    if (existing) {
      return { orderId: existing.id, orderNo: existing.orderNo, synced: false };
    }

    const order = this.orderRepository.create({
      orderNo: data.orderNo,
      userId: data.userId,
      quoteId: data.quoteId ?? null,
      status: OrderStatus.WAITING_DEPOSIT,
      recipientName: data.recipientName,
      recipientPhone: data.recipientPhone,
      postalCode: data.postalCode,
      address1: data.address1,
      address2: data.address2 ?? null,
      deliveryMemo: data.deliveryMemo ?? null,
      subtotalPartsPrice: data.subtotalPartsPrice,
      assemblyFee: data.assemblyFee,
      windowsFee: data.windowsFee,
      shippingFee: data.shippingFee,
      totalPrice: data.totalPrice,
    } as any);

    const savedOrder = await this.orderRepository.save(order) as unknown as Order;

    for (const part of data.parts) {
      const item = this.orderItemRepository.create({
        orderId: savedOrder.id,
        categoryCode: part.categoryCode,
        partNameSnapshot: part.partName,
        quantity: part.quantity,
        publicPrice: part.price,
        totalPublicPrice: part.price * part.quantity,
      });
      await this.orderItemRepository.save(item);
    }

    const history = this.historyRepository.create({
      orderId: savedOrder.id,
      fromStatus: null,
      toStatus: OrderStatus.WAITING_DEPOSIT,
      memo: '주문이 접수되었습니다. 안내된 계좌로 입금해주시면 확인 후 조립을 시작합니다.',
    });
    await this.historyRepository.save(history);

    return { orderId: savedOrder.id, orderNo: savedOrder.orderNo, synced: true };
  }

  async updateShipping(id: number, data: { trackingCompany?: string; trackingNo?: string; memo?: string }) {
    const order = await this.orderRepository.findOne({ where: { id: id.toString() } });
    if (!order) throw new NotFoundException('주문을 찾을 수 없습니다.');

    const prevStatus = order.status;
    order.trackingCompany = data.trackingCompany || 'CJ';
    order.trackingNo = data.trackingNo || null;
    if (data.trackingNo && ![OrderStatus.SHIPPING, OrderStatus.DELIVERED].includes(order.status)) {
      order.status = OrderStatus.SHIPPING;
    }
    await this.orderRepository.save(order);

    const history = this.historyRepository.create({
      orderId: order.id,
      fromStatus: prevStatus,
      toStatus: order.status,
      memo: data.memo ?? `운송장번호가 등록되었습니다. (${order.trackingCompany} ${order.trackingNo ?? ''})`,
    });
    await this.historyRepository.save(history);

    return order;
  }

  async createOrder(data: any) {
    const order = this.orderRepository.create(data);
    return this.orderRepository.save(order);
  }
}
