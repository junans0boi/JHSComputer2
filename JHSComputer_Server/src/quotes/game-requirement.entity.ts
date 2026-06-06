import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { QualityPreset, Resolution } from '../common/enums';
import { Game } from './game.entity';

@Entity('game_requirements')
export class GameRequirement {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
    name: 'GAME_REQUIREMENT_ID',
  })
  id!: string;

  @Column({ name: 'GAME_ID', type: 'bigint' })
  gameId!: string;

  @ManyToOne(() => Game, (game) => game.requirements, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'GAME_ID' })
  game!: Game;

  @Column({ name: 'RESOLUTION', type: 'varchar', length: 30 })
  resolution!: Resolution;

  @Column({ name: 'TARGET_FPS', type: 'int' })
  targetFps!: number;

  @Column({ name: 'QUALITY_PRESET', type: 'varchar', length: 30 })
  qualityPreset!: QualityPreset;

  @Column({ name: 'CPU_SCORE_MIN', type: 'int', nullable: true })
  cpuScoreMin!: number | null;

  @Column({ name: 'GPU_SCORE_MIN', type: 'int', nullable: true })
  gpuScoreMin!: number | null;

  @Column({ name: 'RAM_GB_MIN', type: 'int', nullable: true })
  ramGbMin!: number | null;
}
