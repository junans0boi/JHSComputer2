import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { DealerPriceRule } from './dealer-price-rule.entity';
import { Part } from './part.entity';

@Entity('part_categories')
@Unique(['code'])
export class PartCategory {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ type: 'varchar', length: 40 })
  code!: string;

  @Column({ type: 'varchar', length: 80 })
  name!: string;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder!: number;

  @Column({ name: 'is_required_for_build', type: 'boolean', default: true })
  isRequiredForBuild!: boolean;

  @OneToMany(() => Part, (part) => part.category)
  parts!: Part[];

  @OneToMany(() => DealerPriceRule, (rule) => rule.category)
  dealerPriceRules!: DealerPriceRule[];
}
