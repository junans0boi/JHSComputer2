import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PriceSourceType, StockStatus } from '../common/enums';
import { SupplierOffer } from './supplier-offer.entity';

@Entity('supplier_offer_prices')
export class SupplierOfferPrice {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'OFFER_PRICE_ID' })
  id!: string;

  @Column({ name: 'SUPPLIER_OFFER_ID', type: 'bigint' })
  supplierOfferId!: string;

  @ManyToOne(() => SupplierOffer, (offer) => offer.prices, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'SUPPLIER_OFFER_ID' })
  supplierOffer!: SupplierOffer;

  @Column({ name: 'PUBLIC_PRICE', type: 'int', default: 0 })
  publicPrice!: number;

  @Column({ name: 'BENEFIT_PRICE', type: 'int', nullable: true })
  benefitPrice!: number | null;

  @Column({ name: 'DISCOUNT_AMOUNT', type: 'int', nullable: true })
  discountAmount!: number | null;

  @Column({ name: 'PRODUCT_REWARD_POINTS', type: 'int', nullable: true })
  productRewardPoints!: number | null;

  @Column({ name: 'MEMBERSHIP_REWARD_POINTS', type: 'int', nullable: true })
  membershipRewardPoints!: number | null;

  @Column({ name: 'BANK_TRANSFER_REWARD_POINTS', type: 'int', nullable: true })
  bankTransferRewardPoints!: number | null;

  @Column({
    name: 'STOCK_STATUS',
    type: 'varchar',
    length: 30,
    default: StockStatus.UNKNOWN,
  })
  stockStatus!: StockStatus;

  @Column({ name: 'DELIVERY_FEE', type: 'int', nullable: true })
  deliveryFee!: number | null;

  @Column({ name: 'SOURCE_TYPE', type: 'varchar', length: 30 })
  sourceType!: PriceSourceType;

  @Column({ name: 'CAPTURED_DT', type: 'datetime' })
  capturedDt!: Date;

  @Column({ name: 'RAW_JSON', type: 'json', nullable: true })
  rawJson!: Record<string, unknown> | null;
}
