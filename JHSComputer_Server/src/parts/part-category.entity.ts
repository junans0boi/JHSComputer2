import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BooleanTransformer } from '../common/transformers';
import { Part } from './part.entity';

@Entity('part_categories')
export class PartCategory {
  @PrimaryGeneratedColumn('increment', { name: 'PART_CATEGORY_ID', type: 'bigint' })
  id!: string;

  @Column({ name: 'CATEGORY_CODE', type: 'varchar', length: 30 })
  code!: string;

  @Column({ name: 'CATEGORY_NAME', type: 'varchar', length: 50 })
  name!: string;

  @Column({ name: 'SORT_ORDER', type: 'int', default: 0 })
  sortOrder!: number;

  @Column({
    name: 'IS_REQUIRED_FOR_BUILD',
    type: 'char',
    length: 1,
    default: 'N',
    transformer: BooleanTransformer,
  })
  isRequiredForBuild!: boolean;

  @Column({
    name: 'IS_ACTIVE',
    type: 'char',
    length: 1,
    default: 'Y',
    transformer: BooleanTransformer,
  })
  isActive!: boolean;

  @OneToMany(() => Part, (part) => part.category)
  parts!: Part[];
}
