import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PriorityType, Purpose, Resolution } from '../common/enums';
import { QuoteTemplateItem } from './quote-template-item.entity';
import { Quote } from './quote.entity';

@Entity('quote_templates')
export class QuoteTemplate {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @Column({ name: 'budget_min', type: 'int' })
  budgetMin!: number;

  @Column({ name: 'budget_max', type: 'int' })
  budgetMax!: number;

  @Column({ type: 'enum', enum: Purpose })
  purpose!: Purpose;

  @Column({ type: 'enum', enum: Resolution })
  resolution!: Resolution;

  @Column({ name: 'priority_type', type: 'enum', enum: PriorityType })
  priorityType!: PriorityType;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @OneToMany(() => QuoteTemplateItem, (item) => item.template)
  items!: QuoteTemplateItem[];

  @OneToMany(() => Quote, (quote) => quote.template)
  quotes!: Quote[];
}
