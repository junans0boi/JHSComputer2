import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Order } from './order.entity';

@Entity('order_status_histories')
export class OrderStatusHistory {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ name: 'order_id', type: 'bigint' })
  orderId!: string;

  @ManyToOne(() => Order, (order) => order.statusHistories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order!: Order;

  @Column({ name: 'from_status', type: 'varchar', length: 60, nullable: true })
  fromStatus!: string | null;

  @Column({ name: 'to_status', type: 'varchar', length: 60 })
  toStatus!: string;

  @Column({ name: 'actor_user_id', type: 'bigint', nullable: true })
  actorUserId!: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'actor_user_id' })
  actorUser!: User | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  memo!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
