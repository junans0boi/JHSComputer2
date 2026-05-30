import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { ListingMatchStatus } from '../common/enums';
import { QuoteItem } from '../quotes/quote-item.entity';
import { PartPrice } from './part-price.entity';
import { Part } from './part.entity';
import { Supplier } from './supplier.entity';

@Entity('supplier_listings')
@Unique(['supplierId', 'externalProductId'])
export class SupplierListing {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ name: 'part_id', type: 'bigint', nullable: true })
  partId!: string | null;

  @ManyToOne(() => Part, (part) => part.supplierListings, { nullable: true })
  @JoinColumn({ name: 'part_id' })
  part!: Part | null;

  @Column({ name: 'supplier_id', type: 'bigint' })
  supplierId!: string;

  @ManyToOne(() => Supplier, (supplier) => supplier.listings)
  @JoinColumn({ name: 'supplier_id' })
  supplier!: Supplier;

  @Column({ name: 'external_product_id', type: 'varchar', length: 120 })
  externalProductId!: string;

  @Column({ name: 'product_name', type: 'varchar', length: 255 })
  productName!: string;

  @Column({ name: 'product_url', type: 'varchar', length: 700 })
  productUrl!: string;

  @Column({ name: 'image_url', type: 'varchar', length: 700, nullable: true })
  imageUrl!: string | null;

  @Column({
    name: 'match_status',
    type: 'enum',
    enum: ListingMatchStatus,
    default: ListingMatchStatus.UNMATCHED,
  })
  matchStatus!: ListingMatchStatus;

  @Column({
    name: 'match_confidence',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  matchConfidence!: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @OneToMany(() => PartPrice, (price) => price.supplierListing)
  prices!: PartPrice[];

  @OneToMany(() => QuoteItem, (item) => item.supplierListing)
  quoteItems!: QuoteItem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
