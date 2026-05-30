import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SpecSource } from '../common/enums';
import { Part } from './part.entity';

@Entity('part_spec_values')
export class PartSpecValue {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ name: 'part_id', type: 'bigint' })
  partId!: string;

  @ManyToOne(() => Part, (part) => part.specValues, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'part_id' })
  part!: Part;

  @Column({ name: 'spec_key', type: 'varchar', length: 80 })
  specKey!: string;

  @Column({ name: 'value_text', type: 'varchar', length: 255, nullable: true })
  valueText!: string | null;

  @Column({
    name: 'value_number',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  valueNumber!: string | null;

  @Column({ name: 'value_bool', type: 'boolean', nullable: true })
  valueBool!: boolean | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  unit!: string | null;

  @Column({ type: 'enum', enum: SpecSource, default: SpecSource.CRAWLED })
  source!: SpecSource;

  @Column({ name: 'is_verified', type: 'boolean', default: false })
  isVerified!: boolean;
}
