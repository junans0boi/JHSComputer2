import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Part } from '../parts/part.entity';
import { SupplierOffer } from '../parts/supplier-offer.entity';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('increment', { name: 'ORDER_ITEM_ID', type: 'bigint' })
  id!: string;

  @Column({ name: 'ORDER_ID', type: 'bigint' })
  orderId!: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ORDER_ID' })
  order!: Order;

  @Column({ name: 'CATEGORY_CODE', type: 'varchar', length: 30 })
  categoryCode!: string;

  @Column({ name: 'PART_ID', type: 'bigint', nullable: true })
  partId!: string | null;

  @ManyToOne(() => Part, (part) => part.orderItems, { nullable: true })
  @JoinColumn({ name: 'PART_ID' })
  part!: Part | null;

  @Column({ name: 'SUPPLIER_OFFER_ID', type: 'bigint', nullable: true })
  supplierOfferId!: string | null;

  @ManyToOne(() => SupplierOffer, { nullable: true })
  @JoinColumn({ name: 'SUPPLIER_OFFER_ID' })
  supplierOffer!: SupplierOffer | null;

  @Column({ name: 'PART_NAME_SNAPSHOT', type: 'varchar', length: 700 })
  partNameSnapshot!: string;

  @Column({ name: 'SUPPLIER_CODE_SNAPSHOT', type: 'varchar', length: 40, nullable: true })
  supplierCodeSnapshot!: string | null;

  @Column({ name: 'EXTERNAL_OFFER_ID_SNAPSHOT', type: 'varchar', length: 120, nullable: true })
  externalOfferIdSnapshot!: string | null;

  @Column({ name: 'OFFER_NAME_SNAPSHOT', type: 'varchar', length: 700, nullable: true })
  offerNameSnapshot!: string | null;

  @Column({ name: 'PRODUCT_URL_SNAPSHOT', type: 'varchar', length: 1000, nullable: true })
  productUrlSnapshot!: string | null;

  @Column({ name: 'QUANTITY', type: 'int', default: 1 })
  quantity!: number;

  @Column({ name: 'PUBLIC_PRICE', type: 'int', default: 0 })
  publicPrice!: number;

  @Column({ name: 'TOTAL_PUBLIC_PRICE', type: 'int', default: 0 })
  totalPublicPrice!: number;
}
