import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BooleanTransformer } from '../common/transformers';
import { GameRequirement } from './game-requirement.entity';

@Entity('benchmark_games')
export class Game {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'BENCHMARK_GAME_ID' })
  id!: string;

  @Column({ name: 'GAME_NAME', type: 'varchar', length: 160 })
  name!: string;

  @Column({ name: 'SLUG', type: 'varchar', length: 160 })
  slug!: string;

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
}
