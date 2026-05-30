import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PriceSourceType, StockStatus } from '../common/enums';
import { SupplierListing } from './supplier-listing.entity';

@Entity('part_prices')
export class PartPrice {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ name: 'supplier_listing_id', type: 'bigint' })
  supplierListingId!: string;

  @ManyToOne(() => SupplierListing, (listing) => listing.prices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'supplier_listing_id' })
  supplierListing!: SupplierListing;

  @Column({ name: 'public_price', type: 'int' })
  publicPrice!: number;

  @Column({ name: 'stock_status', type: 'enum', enum: StockStatus, default: StockStatus.UNKNOWN })
  stockStatus!: StockStatus;

  @Column({ name: 'delivery_fee', type: 'int', nullable: true })
  deliveryFee!: number | null;

  @Column({ name: 'captured_at', type: 'datetime' })
  capturedAt!: Date;

  @Column({ name: 'source_type', type: 'enum', enum: PriceSourceType })
  sourceType!: PriceSourceType;

  @Column({ name: 'raw_json', type: 'json', nullable: true })
  rawJson!: Record<string, unknown> | null;
}
