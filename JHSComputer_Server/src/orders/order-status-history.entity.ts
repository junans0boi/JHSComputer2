import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Order } from './order.entity';

@Entity('order_status_histories')
export class OrderStatusHistory {
  @PrimaryGeneratedColumn('increment', { name: 'ORDER_STATUS_HISTORY_ID', type: 'bigint' })
  id!: string;

  @Column({ name: 'ORDER_ID', type: 'bigint' })
  orderId!: string;

  @ManyToOne(() => Order, (order) => order.statusHistories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ORDER_ID' })
  order!: Order;

  @Column({ name: 'FROM_STATUS', type: 'varchar', length: 40, nullable: true })
  fromStatus!: string | null;

  @Column({ name: 'TO_STATUS', type: 'varchar', length: 40 })
  toStatus!: string;

  @Column({ name: 'ACTOR_USER_ID', type: 'bigint', nullable: true })
  actorUserId!: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'ACTOR_USER_ID' })
  actorUser!: User | null;

  @Column({ name: 'MEMO', type: 'varchar', length: 255, nullable: true })
  memo!: string | null;

  @CreateDateColumn({ name: 'CREATED_DT' })
  createdAt!: Date;
}
