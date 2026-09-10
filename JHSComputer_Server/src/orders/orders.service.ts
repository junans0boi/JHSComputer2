import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { DiscordService } from '../discord/discord.service';
import { OrderStatus } from '../common/enums';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatusHistory } from './order-status-history.entity';

const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PRICE_APPROVAL_REQUIRED]: [OrderStatus.ADMIN_REVIEW, OrderStatus.CANCELLED, OrderStatus.ON_HOLD],
  [OrderStatus.ADMIN_REVIEW]: [OrderStatus.WAITING_DEPOSIT, OrderStatus.PRICE_APPROVAL_REQUIRED, OrderStatus.CANCELLED, OrderStatus.ON_HOLD],
  [OrderStatus.WAITING_DEPOSIT]: [OrderStatus.DEPOSIT_CONFIRMED, OrderStatus.CANCELLED, OrderStatus.ON_HOLD],
  [OrderStatus.DEPOSIT_CONFIRMED]: [OrderStatus.PARTS_ORDERING, OrderStatus.CANCELLED, OrderStatus.REFUNDED, OrderStatus.ON_HOLD],
  [OrderStatus.PARTS_ORDERING]: [OrderStatus.PARTS_WAITING, OrderStatus.PARTS_ARRIVED, OrderStatus.CANCELLED, OrderStatus.ON_HOLD],
  [OrderStatus.PARTS_WAITING]: [OrderStatus.PARTS_ARRIVED, OrderStatus.CANCELLED, OrderStatus.ON_HOLD],
  [OrderStatus.PARTS_ARRIVED]: [OrderStatus.ASSEMBLING, OrderStatus.CANCELLED, OrderStatus.ON_HOLD],
  [OrderStatus.ASSEMBLING]: [OrderStatus.TESTING, OrderStatus.ON_HOLD],
  [OrderStatus.TESTING]: [OrderStatus.PREPARING_DELIVERY, OrderStatus.ON_HOLD],
  [OrderStatus.PREPARING_DELIVERY]: [OrderStatus.SHIPPING, OrderStatus.ON_HOLD],
  [OrderStatus.SHIPPING]: [OrderStatus.DELIVERED, OrderStatus.ON_HOLD],
  [OrderStatus.DELIVERED]: [OrderStatus.PURCHASE_CONFIRMED, OrderStatus.REVIEW_AVAILABLE],
  [OrderStatus.PURCHASE_CONFIRMED]: [OrderStatus.REVIEW_AVAILABLE],
  [OrderStatus.REVIEW_AVAILABLE]: [],
  [OrderStatus.ON_HOLD]: [OrderStatus.ADMIN_REVIEW, OrderStatus.WAITING_DEPOSIT, OrderStatus.DEPOSIT_CONFIRMED, OrderStatus.CANCELLED],
  [OrderStatus.CANCELLED]: [OrderStatus.REFUNDED],
  [OrderStatus.REFUNDED]: [],
};

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(OrderStatusHistory)
    private readonly historyRepository: Repository<OrderStatusHistory>,
    private readonly dataSource: DataSource,
    private readonly discordService: DiscordService,
  ) {}

  async getOrders(params: { userId?: number; page: number; limit: number }) {
    const { page, limit } = normalizePagination(params.page, params.limit);
    const { userId } = params;
    const query = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('order.statusHistories', 'statusHistories');

    if (userId) query.andWhere('order.userId = :userId', { userId: userId.toString() });

    const [items, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('order.createdAt', 'DESC')
      .getManyAndCount();

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getMyOrders(userId: string, page = 1, limit = 20) {
    const normalized = normalizePagination(page, limit);
    const [items, total] = await this.orderRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (normalized.page - 1) * normalized.limit,
      take: normalized.limit,
    });
    return { items, total, page: normalized.page, limit: normalized.limit, totalPages: Math.ceil(total / normalized.limit) };
  }

  async getOrderDetail(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id: id.toString() },
      relations: ['user', 'items', 'payments', 'statusHistories'],
    });
    if (!order) throw new NotFoundException('주문을 찾을 수 없습니다.');
    return order;
  }

  async getOrderByNo(orderNo: string) {
    const order = await this.orderRepository.findOne({ where: { orderNo } });
    if (!order) throw new NotFoundException('주문번호로 조회된 주문이 없습니다.');

    return {
      id: order.id,
      orderNo: order.orderNo,
      status: order.status,
      recipientName: maskName(order.recipientName),
      address1: maskAddress(order.address1),
      address2: null,
      totalPrice: order.totalPrice,
      trackingCompany: order.trackingCompany,
      trackingNo: order.trackingNo,
      createdAt: order.createdAt,
    };
  }

  async updateOrderStatus(id: number, status: OrderStatus, memo?: string, actorUserId?: string) {
    const updated = await this.dataSource.transaction(async (manager) => {
      const orderRepository = manager.getRepository(Order);
      const historyRepository = manager.getRepository(OrderStatusHistory);
      const order = await orderRepository.findOne({ where: { id: id.toString() } });
      if (!order) throw new NotFoundException('주문을 찾을 수 없습니다.');
      if (order.status === status) return order;
      if (!allowedTransitions[order.status]?.includes(status)) {
        throw new ConflictException(`${order.status}에서 ${status} 상태로 변경할 수 없습니다.`);
      }

      const previousStatus = order.status;
      order.status = status;
      const saved = await orderRepository.save(order);
      await historyRepository.save(historyRepository.create({
        orderId: saved.id,
        fromStatus: previousStatus,
        toStatus: status,
        actorUserId: actorUserId ?? null,
        memo: memo ?? null,
      }));
      return saved;
    });

    void this.discordService.sendStatusNotification(updated.orderNo, status, memo);
    return updated;
  }

  async updateShipping(id: number, data: { trackingCompany?: string; trackingNo?: string; memo?: string }, actorUserId?: string) {
    const updated = await this.dataSource.transaction(async (manager) => {
      const orderRepository = manager.getRepository(Order);
      const historyRepository = manager.getRepository(OrderStatusHistory);
      const order = await orderRepository.findOne({ where: { id: id.toString() } });
      if (!order) throw new NotFoundException('주문을 찾을 수 없습니다.');

      const previousStatus = order.status;
      order.trackingCompany = data.trackingCompany ?? order.trackingCompany ?? null;
      order.trackingNo = data.trackingNo ?? order.trackingNo ?? null;
      if (order.trackingNo && ![OrderStatus.SHIPPING, OrderStatus.DELIVERED].includes(order.status)) {
        if (!allowedTransitions[order.status]?.includes(OrderStatus.SHIPPING)) {
          throw new ConflictException('현재 주문 상태에서는 운송장을 등록할 수 없습니다.');
        }
        order.status = OrderStatus.SHIPPING;
      }
      const saved = await orderRepository.save(order);
      if (saved.status !== previousStatus || data.trackingNo || data.trackingCompany) {
        await historyRepository.save(historyRepository.create({
          orderId: saved.id,
          fromStatus: previousStatus,
          toStatus: saved.status,
          actorUserId: actorUserId ?? null,
          memo: data.memo ?? `운송장번호가 등록되었습니다. (${saved.trackingCompany ?? ''} ${saved.trackingNo ?? ''})`,
        }));
      }
      return saved;
    });

    return updated;
  }
}

function normalizePagination(page: number, limit: number) {
  return {
    page: Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1,
    limit: Number.isFinite(limit) ? Math.min(100, Math.max(1, Math.floor(limit))) : 20,
  };
}

function maskName(value: string) {
  const chars = [...value];
  if (chars.length <= 1) return '*';
  if (chars.length === 2) return `${chars[0]}*`;
  return `${chars[0]}${'*'.repeat(chars.length - 2)}${chars.at(-1)}`;
}

function maskAddress(value: string) {
  const parts = value.trim().split(/\s+/);
  if (parts.length <= 1) return '***';
  return `${parts.slice(0, 2).join(' ')} ***`;
}
