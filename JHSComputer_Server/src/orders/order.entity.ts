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
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'ORDER_ID' })
  id!: string;

  @Column({ name: 'ORDER_NO', type: 'varchar', length: 50, unique: true })
  orderNo!: string;

  @Column({ name: 'USER_ID', type: 'bigint' })
  userId!: string;

  @ManyToOne(() => User, (user) => user.orders, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'USER_ID' })
  user!: User;

  @Column({ name: 'QUOTE_ID', type: 'bigint', nullable: true })
  quoteId!: string | null;

  @ManyToOne(() => Quote, (quote) => quote.orders, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'QUOTE_ID' })
  quote!: Quote | null;

  @Column({
    name: 'STATUS',
    type: 'varchar',
    length: 40,
    default: OrderStatus.ADMIN_REVIEW,
  })
  status!: OrderStatus;

  @Column({
    name: 'PRICE_CHECK_STATUS',
    type: 'varchar',
    length: 30,
    default: 'NOT_CHECKED',
  })
  priceCheckStatus!: string;

  @Column({ name: 'PRICE_CHECKED_DT', type: 'datetime', nullable: true })
  priceCheckedDt!: Date | null;

  @Column({ name: 'PRICE_CHANGE_JSON', type: 'json', nullable: true })
  priceChangeJson!: any | null;

  @Column({ name: 'PRICE_APPROVED_DT', type: 'datetime', nullable: true })
  priceApprovedDt!: Date | null;

  @Column({ name: 'RECIPIENT_NAME', type: 'varchar', length: 100 })
  recipientName!: string;

  @Column({ name: 'RECIPIENT_PHONE', type: 'varchar', length: 20 })
  recipientPhone!: string;

  @Column({ name: 'POSTAL_CODE', type: 'varchar', length: 20 })
  postalCode!: string;

  @Column({ name: 'ADDRESS1', type: 'varchar', length: 255 })
  address1!: string;

  @Column({ name: 'ADDRESS2', type: 'varchar', length: 255, nullable: true })
  address2!: string | null;

  @Column({
    name: 'DELIVERY_MEMO',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  deliveryMemo!: string | null;

  @Column({ name: 'TRACKING_COMPANY', type: 'varchar', length: 40, nullable: true })
  trackingCompany!: string | null;

  @Column({ name: 'TRACKING_NO', type: 'varchar', length: 80, nullable: true })
  trackingNo!: string | null;

  @Column({ name: 'SUBTOTAL_PARTS_PRICE', type: 'int', default: 0 })
  subtotalPartsPrice!: number;

  @Column({ name: 'ASSEMBLY_FEE', type: 'int', default: 0 })
  assemblyFee!: number;

  @Column({ name: 'WINDOWS_FEE', type: 'int', default: 0 })
  windowsFee!: number;

  @Column({ name: 'SHIPPING_FEE', type: 'int', default: 0 })
  shippingFee!: number;

  @Column({ name: 'TOTAL_PRICE', type: 'int', default: 0 })
  totalPrice!: number;

  @OneToMany(() => OrderItem, (item) => item.order)
  items!: OrderItem[];

  @OneToMany(() => Payment, (payment) => payment.order)
  payments!: Payment[];

  @OneToMany(() => OrderStatusHistory, (history) => history.order)
  statusHistories!: OrderStatusHistory[];

  @CreateDateColumn({ name: 'CREATED_DT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_DT', nullable: true })
  updatedAt!: Date | null;
}
