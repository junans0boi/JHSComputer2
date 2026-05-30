import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PartCategory } from '../parts/part-category.entity';
import { Part } from '../parts/part.entity';
import { QuoteTemplate } from './quote-template.entity';

@Entity('quote_template_items')
export class QuoteTemplateItem {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ name: 'template_id', type: 'bigint' })
  templateId!: string;

  @ManyToOne(() => QuoteTemplate, (template) => template.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'template_id' })
  template!: QuoteTemplate;

  @Column({ name: 'category_id', type: 'bigint' })
  categoryId!: string;

  @ManyToOne(() => PartCategory)
  @JoinColumn({ name: 'category_id' })
  category!: PartCategory;

  @Column({ name: 'part_id', type: 'bigint' })
  partId!: string;

  @ManyToOne(() => Part, (part) => part.quoteTemplateItems)
  @JoinColumn({ name: 'part_id' })
  part!: Part;

  @Column({ name: 'is_replaceable', type: 'boolean', default: true })
  isReplaceable!: boolean;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder!: number;
}
