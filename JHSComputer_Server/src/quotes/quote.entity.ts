import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  BudgetScope,
  PriorityType,
  Purpose,
  QuoteStatus,
  Resolution,
  WindowsOption,
} from '../common/enums';
import { Order } from '../orders/order.entity';
import { User } from '../users/user.entity';
import { CompatibilityCheck } from './compatibility-check.entity';
import { PriceCheckLog } from './price-check-log.entity';
import { QuoteHistory } from './quote-history.entity';
import { QuoteItem } from './quote-item.entity';
import { QuoteTemplate } from './quote-template.entity';

@Entity('quotes')
export class Quote {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ name: 'user_id', type: 'bigint' })
  userId!: string;

  @ManyToOne(() => User, (user) => user.quotes)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'template_id', type: 'bigint', nullable: true })
  templateId!: string | null;

  @ManyToOne(() => QuoteTemplate, (template) => template.quotes, { nullable: true })
  @JoinColumn({ name: 'template_id' })
  template!: QuoteTemplate | null;

  @Column({ type: 'enum', enum: QuoteStatus, default: QuoteStatus.ACTIVE })
  status!: QuoteStatus;

  @Column({ name: 'budget_amount', type: 'int' })
  budgetAmount!: number;

  @Column({ name: 'budget_scope', type: 'enum', enum: BudgetScope, default: BudgetScope.FULL_TOTAL })
  budgetScope!: BudgetScope;

  @Column({ type: 'enum', enum: Purpose })
  purpose!: Purpose;

  @Column({ type: 'enum', enum: Resolution, nullable: true })
  resolution!: Resolution | null;

  @Column({ name: 'monitor_input', type: 'varchar', length: 255, nullable: true })
  monitorInput!: string | null;

  @Column({ name: 'target_games_json', type: 'json', nullable: true })
  targetGamesJson!: string[] | null;

  @Column({ name: 'storage_preference', type: 'varchar', length: 40 })
  storagePreference!: string;

  @Column({ name: 'windows_option', type: 'enum', enum: WindowsOption, default: WindowsOption.NONE })
  windowsOption!: WindowsOption;

  @Column({ name: 'priority_type', type: 'enum', enum: PriorityType, default: PriorityType.VALUE })
  priorityType!: PriorityType;

  @Column({ name: 'aesthetic_option', type: 'varchar', length: 80, nullable: true })
  aestheticOption!: string | null;

  @Column({ name: 'subtotal_parts_price', type: 'int', default: 0 })
  subtotalPartsPrice!: number;

  @Column({ name: 'assembly_fee', type: 'int', default: 0 })
  assemblyFee!: number;

  @Column({ name: 'windows_fee', type: 'int', default: 0 })
  windowsFee!: number;

  @Column({ name: 'shipping_fee', type: 'int', default: 0 })
  shippingFee!: number;

  @Column({ name: 'total_price', type: 'int', default: 0 })
  totalPrice!: number;

  @Column({ name: 'last_price_checked_at', type: 'datetime', nullable: true })
  lastPriceCheckedAt!: Date | null;

  @OneToMany(() => QuoteItem, (item) => item.quote)
  items!: QuoteItem[];

  @OneToMany(() => QuoteHistory, (history) => history.quote)
  histories!: QuoteHistory[];

  @OneToMany(() => CompatibilityCheck, (check) => check.quote)
  compatibilityChecks!: CompatibilityCheck[];

  @OneToMany(() => PriceCheckLog, (log) => log.quote)
  priceCheckLogs!: PriceCheckLog[];

  @OneToMany(() => Order, (order) => order.quote)
  orders!: Order[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
