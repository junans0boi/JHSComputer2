import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { GameRequirement } from './game-requirement.entity';
import { PerformanceEstimate } from './performance-estimate.entity';

@Entity('games')
@Unique(['slug'])
export class Game {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @Column({ type: 'varchar', length: 120 })
  slug!: string;

  @Column({ type: 'int', default: 0 })
  priority!: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @OneToMany(() => GameRequirement, (requirement) => requirement.game)
  requirements!: GameRequirement[];

  @OneToMany(() => PerformanceEstimate, (estimate) => estimate.game)
  performanceEstimates!: PerformanceEstimate[];
}
