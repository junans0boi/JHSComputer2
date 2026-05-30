import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PriceCheckStatus } from '../common/enums';
import { Quote } from './quote.entity';

@Entity('price_check_logs')
export class PriceCheckLog {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ name: 'quote_id', type: 'bigint' })
  quoteId!: string;

  @ManyToOne(() => Quote, (quote) => quote.priceCheckLogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quote_id' })
  quote!: Quote;

  @Column({ type: 'enum', enum: PriceCheckStatus })
  status!: PriceCheckStatus;

  @Column({ name: 'before_total_price', type: 'int' })
  beforeTotalPrice!: number;

  @Column({ name: 'after_total_price', type: 'int', nullable: true })
  afterTotalPrice!: number | null;

  @Column({ name: 'changed_items_json', type: 'json', nullable: true })
  changedItemsJson!: Record<string, unknown> | null;

  @Column({ name: 'checked_at', type: 'datetime' })
  checkedAt!: Date;
}
