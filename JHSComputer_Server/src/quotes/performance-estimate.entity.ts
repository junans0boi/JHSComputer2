import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PerformanceGrade, QualityPreset, Resolution } from '../common/enums';
import { Part } from '../parts/part.entity';
import { Game } from './game.entity';

@Entity('performance_estimates')
export class PerformanceEstimate {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ name: 'game_id', type: 'bigint' })
  gameId!: string;

  @ManyToOne(() => Game, (game) => game.performanceEstimates, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'game_id' })
  game!: Game;

  @Column({ name: 'cpu_part_id', type: 'bigint', nullable: true })
  cpuPartId!: string | null;

  @ManyToOne(() => Part, { nullable: true })
  @JoinColumn({ name: 'cpu_part_id' })
  cpuPart!: Part | null;

  @Column({ name: 'gpu_part_id', type: 'bigint', nullable: true })
  gpuPartId!: string | null;

  @ManyToOne(() => Part, { nullable: true })
  @JoinColumn({ name: 'gpu_part_id' })
  gpuPart!: Part | null;

  @Column({ type: 'enum', enum: Resolution })
  resolution!: Resolution;

  @Column({ name: 'quality_preset', type: 'enum', enum: QualityPreset })
  qualityPreset!: QualityPreset;

  @Column({ name: 'fps_min', type: 'int', nullable: true })
  fpsMin!: number | null;

  @Column({ name: 'fps_max', type: 'int', nullable: true })
  fpsMax!: number | null;

  @Column({ type: 'enum', enum: PerformanceGrade })
  grade!: PerformanceGrade;

  @Column({ name: 'source_summary', type: 'varchar', length: 255, nullable: true })
  sourceSummary!: string | null;

  @Column({ name: 'verified_at', type: 'datetime', nullable: true })
  verifiedAt!: Date | null;
}
