import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatus } from '../common/enums';
import { Quote } from '../quotes/quote.entity';
import { User } from '../users/user.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatusHistory } from './order-status-history.entity';
import { Payment } from './payment.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ name: 'order_no', type: 'varchar', length: 40, unique: true })
  orderNo!: string;

  @Column({ name: 'user_id', type: 'bigint' })
  userId!: string;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'quote_id', type: 'bigint' })
  quoteId!: string;

  @ManyToOne(() => Quote, (quote) => quote.orders)
  @JoinColumn({ name: 'quote_id' })
  quote!: Quote;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.ADMIN_REVIEW })
  status!: OrderStatus;

  @Column({ name: 'recipient_name', type: 'varchar', length: 80 })
  recipientName!: string;

  @Column({ name: 'recipient_phone', type: 'varchar', length: 30 })
  recipientPhone!: string;

  @Column({ name: 'postal_code', type: 'varchar', length: 20 })
  postalCode!: string;

  @Column({ type: 'varchar', length: 255 })
  address1!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address2!: string | null;

  @Column({ name: 'delivery_memo', type: 'varchar', length: 255, nullable: true })
  deliveryMemo!: string | null;

  @Column({ name: 'subtotal_parts_price', type: 'int', default: 0 })
  subtotalPartsPrice!: number;

  @Column({ name: 'assembly_fee', type: 'int', default: 0 })
  assemblyFee!: number;

  @Column({ name: 'windows_fee', type: 'int', default: 0 })
  windowsFee!: number;

  @Column({ name: 'shipping_fee', type: 'int', default: 0 })
  shippingFee!: number;

  @Column({ name: 'total_price', type: 'int', default: 0 })
  totalPrice!: number;

  @Column({ name: 'estimated_total_buy_price', type: 'int', nullable: true })
  estimatedTotalBuyPrice!: number | null;

  @Column({ name: 'actual_total_buy_price', type: 'int', nullable: true })
  actualTotalBuyPrice!: number | null;

  @Column({ name: 'estimated_margin', type: 'int', nullable: true })
  estimatedMargin!: number | null;

  @Column({ name: 'actual_margin', type: 'int', nullable: true })
  actualMargin!: number | null;

  @OneToMany(() => OrderItem, (item) => item.order)
  items!: OrderItem[];

  @OneToMany(() => Payment, (payment) => payment.order)
  payments!: Payment[];

  @OneToMany(() => OrderStatusHistory, (history) => history.order)
  statusHistories!: OrderStatusHistory[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
