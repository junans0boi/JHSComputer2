import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Part } from '../part.entity';

@Entity('gpu_specs')
export class GpuSpec {
  @PrimaryColumn({ name: 'PART_ID', type: 'bigint' })
  id!: string;

  @OneToOne(() => Part, (part) => part.gpuSpec, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'PART_ID' })
  part!: Part;

  @Column({ name: 'CHIPSET_MAKER', type: 'varchar', length: 50, nullable: true })
  chipsetMaker!: string | null;

  @Column({ name: 'CHIPSET_NAME', type: 'varchar', length: 100, nullable: true })
  chipsetName!: string | null;

  @Column({ name: 'SERIES_NAME', type: 'varchar', length: 100, nullable: true })
  seriesName!: string | null;

  @Column({ name: 'MEMORY_TYPE', type: 'varchar', length: 50, nullable: true })
  memoryType!: string | null;

  @Column({ name: 'MEMORY_GB', type: 'int', nullable: true })
  memoryGb!: number | null;

  @Column({ name: 'INTERFACE_TEXT', type: 'varchar', length: 120, nullable: true })
  interfaceText!: string | null;

  @Column({ name: 'RECOMMENDED_PSU_W', type: 'int', nullable: true })
  recommendedPsuW!: number | null;

  @Column({ name: 'POWER_CONSUMPTION_W', type: 'int', nullable: true })
  powerConsumptionW!: number | null;

  @Column({ name: 'POWER_PORTS_JSON', type: 'json', nullable: true })
  powerPortsJson!: any | null;

  @Column({ name: 'LENGTH_MM', type: 'decimal', precision: 8, scale: 2, nullable: true })
  lengthMm!: string | null;

  @Column({ name: 'HEIGHT_MM', type: 'decimal', precision: 8, scale: 2, nullable: true })
  heightMm!: string | null;

  @Column({ name: 'THICKNESS_MM', type: 'decimal', precision: 8, scale: 2, nullable: true })
  thicknessMm!: string | null;

  @Column({ name: 'DISPLAY_OUTPUTS_JSON', type: 'json', nullable: true })
  displayOutputsJson!: any | null;

  @UpdateDateColumn({ name: 'UPDATED_DT' })
  updatedAt!: Date;
}
