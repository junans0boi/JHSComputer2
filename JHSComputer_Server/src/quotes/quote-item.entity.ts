import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PartCategory } from '../parts/part-category.entity';
import { Part } from '../parts/part.entity';
import { SupplierListing } from '../parts/supplier-listing.entity';
import { Quote } from './quote.entity';

@Entity('quote_items')
export class QuoteItem {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ name: 'quote_id', type: 'bigint' })
  quoteId!: string;

  @ManyToOne(() => Quote, (quote) => quote.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quote_id' })
  quote!: Quote;

  @Column({ name: 'category_id', type: 'bigint' })
  categoryId!: string;

  @ManyToOne(() => PartCategory)
  @JoinColumn({ name: 'category_id' })
  category!: PartCategory;

  @Column({ name: 'part_id', type: 'bigint' })
  partId!: string;

  @ManyToOne(() => Part, (part) => part.quoteItems)
  @JoinColumn({ name: 'part_id' })
  part!: Part;

  @Column({ name: 'supplier_listing_id', type: 'bigint', nullable: true })
  supplierListingId!: string | null;

  @ManyToOne(() => SupplierListing, (listing) => listing.quoteItems, { nullable: true })
  @JoinColumn({ name: 'supplier_listing_id' })
  supplierListing!: SupplierListing | null;

  @Column({ type: 'int', default: 1 })
  quantity!: number;

  @Column({ name: 'current_public_price', type: 'int', default: 0 })
  currentPublicPrice!: number;

  @Column({ name: 'estimated_buy_price', type: 'int', nullable: true })
  estimatedBuyPrice!: number | null;

  @Column({ name: 'estimated_margin', type: 'int', nullable: true })
  estimatedMargin!: number | null;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder!: number;
}
