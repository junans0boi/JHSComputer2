import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Part } from '../parts/part.entity';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ name: 'order_id', type: 'bigint' })
  orderId!: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order!: Order;

  @Column({ name: 'category_code', type: 'varchar', length: 40 })
  categoryCode!: string;

  @Column({ name: 'part_id', type: 'bigint', nullable: true })
  partId!: string | null;

  @ManyToOne(() => Part, (part) => part.orderItems, { nullable: true })
  @JoinColumn({ name: 'part_id' })
  part!: Part | null;

  @Column({ name: 'part_name_snapshot', type: 'varchar', length: 255 })
  partNameSnapshot!: string;

  @Column({ name: 'supplier_code_snapshot', type: 'varchar', length: 60, nullable: true })
  supplierCodeSnapshot!: string | null;

  @Column({ name: 'supplier_product_id_snapshot', type: 'varchar', length: 120, nullable: true })
  supplierProductIdSnapshot!: string | null;

  @Column({ name: 'product_url_snapshot', type: 'varchar', length: 700, nullable: true })
  productUrlSnapshot!: string | null;

  @Column({ type: 'int', default: 1 })
  quantity!: number;

  @Column({ name: 'public_price', type: 'int', default: 0 })
  publicPrice!: number;

  @Column({ name: 'estimated_buy_price', type: 'int', nullable: true })
  estimatedBuyPrice!: number | null;

  @Column({ name: 'actual_buy_price', type: 'int', nullable: true })
  actualBuyPrice!: number | null;
}
