import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Part } from '../part.entity';

@Entity('ram_specs')
export class RamSpec {
  @PrimaryColumn({ name: 'PART_ID', type: 'bigint' })
  id!: string;

  @OneToOne(() => Part, (part) => part.ramSpec, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'PART_ID' })
  part!: Part;

  @Column({ name: 'MEMORY_TYPE', type: 'varchar', length: 50 })
  memoryType!: string;

  @Column({ name: 'CAPACITY_GB', type: 'int' })
  capacityGb!: number;

  @Column({ name: 'MODULE_COUNT', type: 'int', nullable: true })
  moduleCount!: number | null;

  @Column({ name: 'SPEED_MHZ', type: 'int', nullable: true })
  speedMhz!: number | null;

  @Column({ name: 'PROFILE_TYPE', type: 'varchar', length: 50, nullable: true })
  profileType!: string | null;

  @UpdateDateColumn({ name: 'UPDATED_DT' })
  updatedAt!: Date;
}
