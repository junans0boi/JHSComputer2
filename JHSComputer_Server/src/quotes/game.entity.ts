import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BooleanTransformer } from '../common/transformers';
import { GameRequirement } from './game-requirement.entity';
import { PerformanceEstimate } from './performance-estimate.entity';

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'GAME_ID' })
  id!: string;

  @Column({ name: 'GAME_NAME', type: 'varchar', length: 100 })
  name!: string;

  @Column({ name: 'SLUG', type: 'varchar', length: 100 })
  slug!: string;

  @Column({ name: 'PRIORITY', type: 'int', default: 0 })
  priority!: number;

  @Column({
    name: 'IS_ACTIVE',
    type: 'char',
    length: 1,
    default: 'Y',
    transformer: BooleanTransformer,
  })
  isActive!: boolean;

  @OneToMany(() => GameRequirement, (requirement) => requirement.game)
  requirements!: GameRequirement[];

  @OneToMany(() => PerformanceEstimate, (estimate) => estimate.game)
  performanceEstimates!: PerformanceEstimate[];
}
