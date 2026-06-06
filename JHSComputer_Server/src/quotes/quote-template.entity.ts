import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PriorityType, Purpose, Resolution } from '../common/enums';
import { BooleanTransformer } from '../common/transformers';
import { QuoteTemplateItem } from './quote-template-item.entity';
import { Quote } from './quote.entity';

@Entity('quote_templates')
export class QuoteTemplate {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
    name: 'QUOTE_TEMPLATE_ID',
  })
  id!: string;

  @Column({ name: 'TEMPLATE_NAME', type: 'varchar', length: 150 })
  name!: string;

  @Column({ name: 'BUDGET_MIN', type: 'int', default: 0 })
  budgetMin!: number;

  @Column({ name: 'BUDGET_MAX', type: 'int', default: 0 })
  budgetMax!: number;

  @Column({ name: 'PURPOSE', type: 'varchar', length: 30 })
  purpose!: Purpose;

  @Column({ name: 'RESOLUTION', type: 'varchar', length: 30, nullable: true })
  resolution!: Resolution | null;

  @Column({
    name: 'PRIORITY_TYPE',
    type: 'varchar',
    length: 30,
    default: PriorityType.VALUE,
  })
  priorityType!: PriorityType;

  @Column({
    name: 'IS_ACTIVE',
    type: 'char',
    length: 1,
    default: 'Y',
    transformer: BooleanTransformer,
  })
  isActive!: boolean;

  @OneToMany(() => QuoteTemplateItem, (item) => item.template)
  items!: QuoteTemplateItem[];

  @OneToMany(() => Quote, (quote) => quote.template)
  quotes!: Quote[];

  @CreateDateColumn({ name: 'CREATED_DT' })
  createdAt!: Date;
}
