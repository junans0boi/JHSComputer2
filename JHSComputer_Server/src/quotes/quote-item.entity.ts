import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PartCategory } from '../parts/part-category.entity';
import { Part } from '../parts/part.entity';
import { SupplierOffer } from '../parts/supplier-offer.entity';
import { Quote } from './quote.entity';

@Entity('quote_items')
export class QuoteItem {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'QUOTE_ITEM_ID' })
  id!: string;

  @Column({ name: 'QUOTE_ID', type: 'bigint' })
  quoteId!: string;

  @ManyToOne(() => Quote, (quote) => quote.items, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'QUOTE_ID' })
  quote!: Quote;

  @Column({ name: 'PART_CATEGORY_ID', type: 'bigint' })
  partCategoryId!: string;

  @ManyToOne(() => PartCategory, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'PART_CATEGORY_ID' })
  category!: PartCategory;

  @Column({ name: 'PART_ID', type: 'bigint' })
  partId!: string;

  @ManyToOne(() => Part, (part) => part.quoteItems, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'PART_ID' })
  part!: Part;

  @Column({ name: 'SUPPLIER_OFFER_ID', type: 'bigint', nullable: true })
  supplierOfferId!: string | null;

  @ManyToOne(() => SupplierOffer, (offer) => offer.quoteItems, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'SUPPLIER_OFFER_ID' })
  supplierOffer!: SupplierOffer | null;

  @Column({ name: 'QUANTITY', type: 'int', default: 1 })
  quantity!: number;

  @Column({ name: 'CURRENT_PUBLIC_PRICE', type: 'int', default: 0 })
  currentPublicPrice!: number;

  @Column({ name: 'SORT_ORDER', type: 'int', default: 0 })
  sortOrder!: number;
}
