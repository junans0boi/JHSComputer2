import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { QuoteHistoryEventType } from '../common/enums';
import { User } from '../users/user.entity';
import { Quote } from './quote.entity';

@Entity('quote_histories')
export class QuoteHistory {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ name: 'quote_id', type: 'bigint' })
  quoteId!: string;

  @ManyToOne(() => Quote, (quote) => quote.histories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quote_id' })
  quote!: Quote;

  @Column({ name: 'actor_user_id', type: 'bigint', nullable: true })
  actorUserId!: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'actor_user_id' })
  actorUser!: User | null;

  @Column({ name: 'event_type', type: 'enum', enum: QuoteHistoryEventType })
  eventType!: QuoteHistoryEventType;

  @Column({ name: 'before_json', type: 'json', nullable: true })
  beforeJson!: Record<string, unknown> | null;

  @Column({ name: 'after_json', type: 'json', nullable: true })
  afterJson!: Record<string, unknown> | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
