import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PerformanceGrade, QualityPreset, Resolution } from '../common/enums';
import { Part } from '../parts/part.entity';
import { Game } from './game.entity';

@Entity('performance_estimates')
export class PerformanceEstimate {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
    name: 'PERFORMANCE_ESTIMATE_ID',
  })
  id!: string;

  @Column({ name: 'GAME_ID', type: 'bigint' })
  gameId!: string;

  @ManyToOne(() => Game, (game) => game.performanceEstimates, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'GAME_ID' })
  game!: Game;

  @Column({ name: 'CPU_PART_ID', type: 'bigint', nullable: true })
  cpuPartId!: string | null;

  @ManyToOne(() => Part, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'CPU_PART_ID' })
  cpuPart!: Part | null;

  @Column({ name: 'GPU_PART_ID', type: 'bigint', nullable: true })
  gpuPartId!: string | null;

  @ManyToOne(() => Part, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'GPU_PART_ID' })
  gpuPart!: Part | null;

  @Column({ name: 'RESOLUTION', type: 'varchar', length: 30 })
  resolution!: Resolution;

  @Column({ name: 'QUALITY_PRESET', type: 'varchar', length: 30 })
  qualityPreset!: QualityPreset;

  @Column({ name: 'FPS_MIN', type: 'int', nullable: true })
  fpsMin!: number | null;

  @Column({ name: 'FPS_MAX', type: 'int', nullable: true })
  fpsMax!: number | null;

  @Column({ name: 'GRADE', type: 'varchar', length: 30 })
  grade!: PerformanceGrade;

  @Column({
    name: 'SOURCE_SUMMARY',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  sourceSummary!: string | null;

  @Column({ name: 'VERIFIED_DT', type: 'datetime', nullable: true })
  verifiedDt!: Date | null;
}
