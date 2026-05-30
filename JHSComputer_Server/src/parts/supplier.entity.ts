import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { SupplierStatus } from '../common/enums';
import { DealerPriceRule } from './dealer-price-rule.entity';
import { SupplierListing } from './supplier-listing.entity';

@Entity('suppliers')
@Unique(['code'])
export class Supplier {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ type: 'varchar', length: 60 })
  code!: string;

  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @Column({ name: 'base_url', type: 'varchar', length: 500, nullable: true })
  baseUrl!: string | null;

  @Column({ type: 'enum', enum: SupplierStatus, default: SupplierStatus.ACTIVE })
  status!: SupplierStatus;

  @OneToMany(() => SupplierListing, (listing) => listing.supplier)
  listings!: SupplierListing[];

  @OneToMany(() => DealerPriceRule, (rule) => rule.supplier)
  dealerPriceRules!: DealerPriceRule[];
}
