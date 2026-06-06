import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BooleanTransformer } from '../common/transformers';
import { PartCategory } from '../parts/part-category.entity';
import { Part } from '../parts/part.entity';
import { QuoteTemplate } from './quote-template.entity';

@Entity('quote_template_items')
export class QuoteTemplateItem {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
    name: 'QUOTE_TEMPLATE_ITEM_ID',
  })
  id!: string;

  @Column({ name: 'QUOTE_TEMPLATE_ID', type: 'bigint' })
  templateId!: string;

  @ManyToOne(() => QuoteTemplate, (template) => template.items, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'QUOTE_TEMPLATE_ID' })
  template!: QuoteTemplate;

  @Column({ name: 'PART_CATEGORY_ID', type: 'bigint' })
  categoryId!: string;

  @ManyToOne(() => PartCategory, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'PART_CATEGORY_ID' })
  category!: PartCategory;

  @Column({ name: 'PART_ID', type: 'bigint', nullable: true })
  partId!: string | null;

  @ManyToOne(() => Part, (part) => part.quoteTemplateItems, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'PART_ID' })
  part!: Part | null;

  @Column({
    name: 'IS_REPLACEABLE',
    type: 'char',
    length: 1,
    default: 'Y',
    transformer: BooleanTransformer,
  })
  isReplaceable!: boolean;

  @Column({ name: 'SORT_ORDER', type: 'int', default: 0 })
  sortOrder!: number;
}
