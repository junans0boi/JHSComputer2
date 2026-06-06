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
import { BooleanTransformer } from '../common/transformers';
import { Supplier } from './supplier.entity';
import { SupplierOffer } from './supplier-offer.entity';

@Entity('supplier_products')
@Unique(['supplierId', 'externalProductId'])
export class SupplierProduct {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'SUPPLIER_PRODUCT_ID' })
  id!: string;

  @Column({ name: 'SUPPLIER_ID', type: 'bigint' })
  supplierId!: string;

  @ManyToOne(() => Supplier, (supplier) => supplier.products, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'SUPPLIER_ID' })
  supplier!: Supplier;

  @Column({ name: 'CRAWL_TARGET_ID', type: 'bigint', nullable: true })
  crawlTargetId!: string | null;

  @Column({ name: 'EXTERNAL_PRODUCT_ID', type: 'varchar', length: 120 })
  externalProductId!: string;

  @Column({ name: 'PRODUCT_NAME', type: 'varchar', length: 500 })
  productName!: string;

  @Column({ name: 'PRODUCT_URL', type: 'varchar', length: 1000 })
  productUrl!: string;

  @Column({ name: 'IMAGE_URL', type: 'varchar', length: 1000, nullable: true })
  imageUrl!: string | null;

  @Column({ name: 'SUMMARY_SPEC_TEXT', type: 'text', nullable: true })
  summarySpecText!: string | null;

  @Column({ name: 'RAW_SPEC_JSON', type: 'json', nullable: true })
  rawSpecJson!: Record<string, unknown> | null;

  @Column({
    name: 'SPEC_PARSE_STATUS',
    type: 'varchar',
    length: 30,
    default: 'UNPARSED',
  })
  specParseStatus!: string;

  @Column({ name: 'SPEC_CAPTURED_DT', type: 'datetime', nullable: true })
  specCapturedDt!: Date | null;

  @Column({ name: 'REVIEW_COUNT', type: 'int', nullable: true })
  reviewCount!: number | null;

  @Column({ name: 'RATING', type: 'decimal', precision: 3, scale: 2, nullable: true })
  rating!: string | null;

  @Column({
    name: 'MATCH_STATUS',
    type: 'varchar',
    length: 30,
    default: ListingMatchStatus.UNMATCHED,
  })
  matchStatus!: ListingMatchStatus;

  @Column({
    name: 'MATCH_CONFIDENCE',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  matchConfidence!: string | null;

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

  @OneToMany(() => SupplierOffer, (offer) => offer.product)
  offers!: SupplierOffer[];

  @CreateDateColumn({ name: 'CREATED_DT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_DT', nullable: true })
  updatedAt!: Date | null;
}
