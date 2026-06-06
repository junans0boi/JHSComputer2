import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Part } from '../part.entity';

@Entity('storage_specs')
export class StorageSpec {
  @PrimaryColumn({ name: 'PART_ID', type: 'bigint' })
  id!: string;

  @OneToOne(() => Part, (part) => part.storageSpec, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'PART_ID' })
  part!: Part;

  @Column({ name: 'STORAGE_TYPE', type: 'varchar', length: 30 })
  storageType!: string;

  @Column({ name: 'FORM_FACTOR', type: 'varchar', length: 50, nullable: true })
  formFactor!: string | null;

  @Column({ name: 'INTERFACE_TEXT', type: 'varchar', length: 120, nullable: true })
  interfaceText!: string | null;

  @Column({ name: 'CAPACITY_GB', type: 'int' })
  capacityGb!: number;

  @Column({ name: 'SEQ_READ_MBPS', type: 'int', nullable: true })
  seqReadMbps!: number | null;

  @Column({ name: 'SEQ_WRITE_MBPS', type: 'int', nullable: true })
  seqWriteMbps!: number | null;

  @UpdateDateColumn({ name: 'UPDATED_DT' })
  updatedAt!: Date;
}
