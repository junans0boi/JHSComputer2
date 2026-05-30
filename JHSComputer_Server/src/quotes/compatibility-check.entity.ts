import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CompatibilityStatus } from '../common/enums';
import { Quote } from './quote.entity';

@Entity('compatibility_checks')
export class CompatibilityCheck {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ name: 'quote_id', type: 'bigint' })
  quoteId!: string;

  @ManyToOne(() => Quote, (quote) => quote.compatibilityChecks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quote_id' })
  quote!: Quote;

  @Column({ type: 'enum', enum: CompatibilityStatus })
  status!: CompatibilityStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  summary!: string | null;

  @Column({ name: 'detail_json', type: 'json' })
  detailJson!: Record<string, unknown>;

  @Column({ name: 'checked_at', type: 'datetime' })
  checkedAt!: Date;
}
