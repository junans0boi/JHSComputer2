import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { BooleanTransformer } from '../common/transformers';
import { OrderItem } from '../orders/order-item.entity';
import { QuoteItem } from '../quotes/quote-item.entity';
import { Part } from './part.entity';
import { SupplierProduct } from './supplier-product.entity';
import { SupplierOfferPrice } from './supplier-offer-price.entity';

@Entity('supplier_offers')
@Unique(['supplierProductId', 'externalOfferId'])
export class SupplierOffer {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'SUPPLIER_OFFER_ID' })
  id!: string;

  @Column({ name: 'SUPPLIER_PRODUCT_ID', type: 'bigint' })
  supplierProductId!: string;

  @ManyToOne(() => SupplierProduct, (product) => product.offers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'SUPPLIER_PRODUCT_ID' })
  product!: SupplierProduct;

  @Column({ name: 'PART_ID', type: 'bigint', nullable: true })
  partId!: string | null;

  @ManyToOne(() => Part, (part) => part.supplierOffers, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'PART_ID' })
  part!: Part | null;

  @Column({ name: 'EXTERNAL_OFFER_ID', type: 'varchar', length: 120 })
  externalOfferId!: string;

  @Column({ name: 'OFFER_NAME', type: 'varchar', length: 700 })
  offerName!: string;

  @Column({ name: 'OPTION_LABEL', type: 'varchar', length: 200, nullable: true })
  optionLabel!: string | null;

  @Column({ name: 'OFFER_KIND', type: 'varchar', length: 30, nullable: true })
  offerKind!: string | null;

  @Column({ name: 'ATTRIBUTES_JSON', type: 'json', nullable: true })
  attributesJson!: Record<string, unknown> | null;

  @Column({ name: 'PACKAGE_TYPE', type: 'varchar', length: 30, nullable: true })
  packageType!: string | null;

  @Column({
    name: 'COOLER_INCLUDED',
    type: 'char',
    length: 1,
    nullable: true,
    transformer: BooleanTransformer,
  })
  coolerIncluded!: boolean | null;

  @Column({
    name: 'IS_DEFAULT',
    type: 'char',
    length: 1,
    default: 'N',
    transformer: BooleanTransformer,
  })
  isDefault!: boolean;

  @Column({
    name: 'IS_ACTIVE',
    type: 'char',
    length: 1,
    default: 'Y',
    transformer: BooleanTransformer,
  })
  isActive!: boolean;

  @Column({ name: 'LAST_SEEN_DT', type: 'datetime', nullable: true })
  lastSeenDt!: Date | null;

  @Column({ name: 'RAW_JSON', type: 'json', nullable: true })
  rawJson!: Record<string, unknown> | null;

  @OneToMany(() => SupplierOfferPrice, (price) => price.supplierOffer)
  prices!: SupplierOfferPrice[];

  @OneToMany(() => QuoteItem, (item) => item.supplierOffer)
  quoteItems!: QuoteItem[];

  @OneToMany(() => OrderItem, (item) => item.supplierOffer)
  orderItems!: OrderItem[];

  @CreateDateColumn({ name: 'CREATED_DT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_DT', nullable: true })
  updatedAt!: Date | null;
}
