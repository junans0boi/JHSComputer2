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
import { PartStatus } from '../common/enums';
import { OrderItem } from '../orders/order-item.entity';
import { QuoteItem } from '../quotes/quote-item.entity';
import { QuoteTemplateItem } from '../quotes/quote-template-item.entity';
import { PartCategory } from './part-category.entity';
import { PartSpecValue } from './part-spec-value.entity';
import { SupplierListing } from './supplier-listing.entity';

@Entity('parts')
export class Part {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ name: 'category_id', type: 'bigint' })
  categoryId!: string;

  @ManyToOne(() => PartCategory, (category) => category.parts)
  @JoinColumn({ name: 'category_id' })
  category!: PartCategory;

  @Column({ name: 'canonical_name', type: 'varchar', length: 255 })
  canonicalName!: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  manufacturer!: string | null;

  @Column({ name: 'model_name', type: 'varchar', length: 180, nullable: true })
  modelName!: string | null;

  @Column({ name: 'thumbnail_url', type: 'varchar', length: 500, nullable: true })
  thumbnailUrl!: string | null;

  @Column({ type: 'enum', enum: PartStatus, default: PartStatus.ACTIVE })
  status!: PartStatus;

  @Column({ name: 'is_admin_approved', type: 'boolean', default: false })
  isAdminApproved!: boolean;

  @Column({ name: 'admin_priority', type: 'int', default: 0 })
  adminPriority!: number;

  @Column({
    name: 'popularity_score',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  popularityScore!: string;

  @Column({ name: 'specs_json', type: 'json', nullable: true })
  specsJson!: Record<string, unknown> | null;

  @Column({ name: 'spec_verified_at', type: 'datetime', nullable: true })
  specVerifiedAt!: Date | null;

  @OneToMany(() => PartSpecValue, (specValue) => specValue.part)
  specValues!: PartSpecValue[];

  @OneToMany(() => SupplierListing, (listing) => listing.part)
  supplierListings!: SupplierListing[];

  @OneToMany(() => QuoteTemplateItem, (item) => item.part)
  quoteTemplateItems!: QuoteTemplateItem[];

  @OneToMany(() => QuoteItem, (item) => item.part)
  quoteItems!: QuoteItem[];

  @OneToMany(() => OrderItem, (item) => item.part)
  orderItems!: OrderItem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
