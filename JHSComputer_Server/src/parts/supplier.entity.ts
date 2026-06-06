import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { SupplierStatus } from '../common/enums';
import { SupplierProduct } from './supplier-product.entity';

@Entity('suppliers')
@Unique(['supplierCode'])
export class Supplier {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'SUPPLIER_ID' })
  id!: string;

  @Column({ name: 'SUPPLIER_CODE', type: 'varchar', length: 40 })
  supplierCode!: string;

  @Column({ name: 'SUPPLIER_NAME', type: 'varchar', length: 100 })
  supplierName!: string;

  @Column({ name: 'BASE_URL', type: 'varchar', length: 300, nullable: true })
  baseUrl!: string | null;

  @Column({
    name: 'STATUS',
    type: 'varchar',
    length: 20,
    default: SupplierStatus.ACTIVE,
  })
  status!: SupplierStatus;

  @OneToMany(() => SupplierProduct, (product) => product.supplier)
  products!: SupplierProduct[];

  @CreateDateColumn({ name: 'CREATED_DT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_DT', nullable: true })
  updatedAt!: Date | null;
}
