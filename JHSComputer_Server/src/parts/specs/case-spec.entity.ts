import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Part } from '../part.entity';

@Entity('case_specs')
export class CaseSpec {
  @PrimaryColumn({ name: 'PART_ID', type: 'bigint' })
  id!: string;

  @OneToOne(() => Part, (part) => part.caseSpec, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'PART_ID' })
  part!: Part;

  @Column({ name: 'CASE_TYPE', type: 'varchar', length: 50, nullable: true })
  caseType!: string | null;

  @Column({ name: 'COLOR', type: 'varchar', length: 50, nullable: true })
  color!: string | null;

  @Column({ name: 'SUPPORTED_BOARD_FORMS_JSON', type: 'json', nullable: true })
  supportedBoardFormsJson!: string[] | null;

  @Column({ name: 'MAX_GPU_LENGTH_MM', type: 'decimal', precision: 8, scale: 2, nullable: true })
  maxGpuLengthMm!: string | null;

  @Column({ name: 'MAX_COOLER_HEIGHT_MM', type: 'decimal', precision: 8, scale: 2, nullable: true })
  maxCoolerHeightMm!: string | null;

  @Column({ name: 'FAN_COUNT', type: 'int', nullable: true })
  fanCount!: number | null;

  @UpdateDateColumn({ name: 'UPDATED_DT' })
  updatedAt!: Date;
}
