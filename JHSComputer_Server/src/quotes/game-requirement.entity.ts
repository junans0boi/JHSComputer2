import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { QualityPreset, Resolution } from '../common/enums';
import { Game } from './game.entity';

@Entity('game_requirements')
export class GameRequirement {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ name: 'game_id', type: 'bigint' })
  gameId!: string;

  @ManyToOne(() => Game, (game) => game.requirements, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'game_id' })
  game!: Game;

  @Column({ type: 'enum', enum: Resolution })
  resolution!: Resolution;

  @Column({ name: 'target_fps', type: 'int' })
  targetFps!: number;

  @Column({ name: 'quality_preset', type: 'enum', enum: QualityPreset })
  qualityPreset!: QualityPreset;

  @Column({ name: 'cpu_score_min', type: 'int', nullable: true })
  cpuScoreMin!: number | null;

  @Column({ name: 'gpu_score_min', type: 'int', nullable: true })
  gpuScoreMin!: number | null;

  @Column({ name: 'ram_gb_min', type: 'int', nullable: true })
  ramGbMin!: number | null;
}
