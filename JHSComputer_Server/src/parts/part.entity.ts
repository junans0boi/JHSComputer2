import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PartStatus } from '../common/enums';
import { BooleanTransformer } from '../common/transformers';
import { OrderItem } from '../orders/order-item.entity';
import { QuoteItem } from '../quotes/quote-item.entity';
import { QuoteTemplateItem } from '../quotes/quote-template-item.entity';
import { PartCategory } from './part-category.entity';
import { SupplierProduct } from './supplier-product.entity';
import { SupplierOffer } from './supplier-offer.entity';
import { CpuSpec } from './specs/cpu-spec.entity';
import { GpuSpec } from './specs/gpu-spec.entity';
import { MainboardSpec } from './specs/mainboard-spec.entity';
import { RamSpec } from './specs/ram-spec.entity';
import { StorageSpec } from './specs/storage-spec.entity';
import { PsuSpec } from './specs/psu-spec.entity';
import { CaseSpec } from './specs/case-spec.entity';
import { CoolerSpec } from './specs/cooler-spec.entity';

@Entity('parts')
export class Part {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'PART_ID' })
  id!: string;

  @Column({ name: 'PART_CATEGORY_ID', type: 'bigint' })
  categoryId!: string;

  @ManyToOne(() => PartCategory, (category) => category.parts, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'PART_CATEGORY_ID' })
  category!: PartCategory;

  @Column({ name: 'CANONICAL_NAME', type: 'varchar', length: 255 })
  canonicalName!: string;

  @Column({ name: 'MANUFACTURER', type: 'varchar', length: 100, nullable: true })
  manufacturer!: string | null;

  @Column({ name: 'MODEL_NAME', type: 'varchar', length: 180, nullable: true })
  modelName!: string | null;

  @Column({ name: 'MODEL_KEY', type: 'varchar', length: 220, nullable: true })
  modelKey!: string | null;

  @Column({ name: 'THUMBNAIL_URL', type: 'varchar', length: 700, nullable: true })
  thumbnailUrl!: string | null;

  @Column({
    name: 'STATUS',
    type: 'varchar',
    length: 30,
    default: PartStatus.ACTIVE,
  })
  status!: PartStatus;

  @Column({
    name: 'IS_ADMIN_APPROVED',
    type: 'char',
    length: 1,
    default: 'N',
    transformer: BooleanTransformer,
  })
  isAdminApproved!: boolean;

  @Column({ name: 'ADMIN_PRIORITY', type: 'int', default: 0 })
  adminPriority!: number;

  @Column({
    name: 'POPULARITY_SCORE',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  popularityScore!: string;

  @Column({
    name: 'SPEC_STATUS',
    type: 'varchar',
    length: 30,
    default: 'UNVERIFIED',
  })
  specStatus!: string;

  @Column({ name: 'SPEC_VERIFIED_DT', type: 'datetime', nullable: true })
  specVerifiedDt!: Date | null;

  @OneToOne(() => CpuSpec, (spec) => spec.part)
  cpuSpec?: CpuSpec;

  @OneToOne(() => GpuSpec, (spec) => spec.part)
  gpuSpec?: GpuSpec;

  @OneToOne(() => MainboardSpec, (spec) => spec.part)
  mainboardSpec?: MainboardSpec;

  @OneToOne(() => RamSpec, (spec) => spec.part)
  ramSpec?: RamSpec;

  @OneToOne(() => StorageSpec, (spec) => spec.part)
  storageSpec?: StorageSpec;

  @OneToOne(() => PsuSpec, (spec) => spec.part)
  psuSpec?: PsuSpec;

  @OneToOne(() => CaseSpec, (spec) => spec.part)
  caseSpec?: CaseSpec;

  @OneToOne(() => CoolerSpec, (spec) => spec.part)
  coolerSpec?: CoolerSpec;

  @OneToMany(() => SupplierOffer, (offer) => offer.part)
  supplierOffers!: SupplierOffer[];

  @OneToMany(() => QuoteTemplateItem, (item) => item.part)
  quoteTemplateItems!: QuoteTemplateItem[];

  @OneToMany(() => QuoteItem, (item) => item.part)
  quoteItems!: QuoteItem[];

  @OneToMany(() => OrderItem, (item) => item.part)
  orderItems!: OrderItem[];

  @CreateDateColumn({ name: 'CREATED_DT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_DT', nullable: true })
  updatedAt!: Date | null;
}
