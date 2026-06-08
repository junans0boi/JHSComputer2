import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderStatus } from '../common/enums';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async getOrders(params: { userId?: number; page: number; limit: number }) {
    const { userId, page, limit } = params;
    const query = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.quote', 'quote');

    if (userId) {
      query.andWhere('order.userId = :userId', { userId });
    }

    const [items, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('order.createdDt', 'DESC')
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
      relations: ['user', 'quote', 'items', 'items.part', 'items.supplierOffer', 'payments', 'statusHistories'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateOrderStatus(id: number, status: string) {
    const order = await this.orderRepository.findOne({ where: { id: id.toString() } });
    if (!order) throw new NotFoundException('Order not found');

    order.status = status as OrderStatus;
    return this.orderRepository.save(order);
  }

  async createOrder(data: any) {
    const order = this.orderRepository.create(data);
    return this.orderRepository.save(order);
  }
}
