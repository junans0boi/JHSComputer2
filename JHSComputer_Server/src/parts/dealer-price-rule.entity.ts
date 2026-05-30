import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PartCategory } from './part-category.entity';
import { Supplier } from './supplier.entity';

@Entity('dealer_price_rules')
export class DealerPriceRule {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ name: 'category_id', type: 'bigint', nullable: true })
  categoryId!: string | null;

  @ManyToOne(() => PartCategory, (category) => category.dealerPriceRules, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category!: PartCategory | null;

  @Column({ name: 'supplier_id', type: 'bigint', nullable: true })
  supplierId!: string | null;

  @ManyToOne(() => Supplier, (supplier) => supplier.dealerPriceRules, { nullable: true })
  @JoinColumn({ name: 'supplier_id' })
  supplier!: Supplier | null;

  @Column({
    name: 'estimated_discount_rate',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
  })
  estimatedDiscountRate!: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  memo!: string | null;
}
