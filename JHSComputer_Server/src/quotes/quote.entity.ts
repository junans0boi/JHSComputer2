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
import { QuoteItem } from './quote-item.entity';
import { QuoteTemplate } from './quote-template.entity';

@Entity('quotes')
export class Quote {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'QUOTE_ID' })
  id!: string;

  @Column({ name: 'USER_ID', type: 'bigint' })
  userId!: string;

  @ManyToOne(() => User, (user) => user.quotes, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'USER_ID' })
  user!: User;

  @Column({ name: 'QUOTE_TEMPLATE_ID', type: 'bigint', nullable: true })
  templateId!: string | null;

  @ManyToOne(() => QuoteTemplate, (template) => template.quotes, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'QUOTE_TEMPLATE_ID' })
  template!: QuoteTemplate | null;

  @Column({
    name: 'STATUS',
    type: 'varchar',
    length: 30,
    default: QuoteStatus.ACTIVE,
  })
  status!: QuoteStatus;

  @Column({ name: 'BUDGET_AMOUNT', type: 'int', default: 0 })
  budgetAmount!: number;

  @Column({
    name: 'BUDGET_SCOPE',
    type: 'varchar',
    length: 30,
    default: BudgetScope.BODY_ONLY,
  })
  budgetScope!: BudgetScope;

  @Column({ name: 'PURPOSE', type: 'varchar', length: 30, nullable: true })
  purpose!: Purpose | null;

  @Column({ name: 'RESOLUTION', type: 'varchar', length: 30, nullable: true })
  resolution!: Resolution | null;

  @Column({ name: 'MONITOR_INPUT', type: 'varchar', length: 150, nullable: true })
  monitorInput!: string | null;

  @Column({ name: 'TARGET_GAMES_JSON', type: 'json', nullable: true })
  targetGamesJson!: string[] | null;

  @Column({
    name: 'STORAGE_PREFERENCE',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  storagePreference!: string | null;

  @Column({
    name: 'WINDOWS_OPTION',
    type: 'varchar',
    length: 30,
    default: WindowsOption.NONE,
  })
  windowsOption!: WindowsOption;

  @Column({
    name: 'PRIORITY_TYPE',
    type: 'varchar',
    length: 30,
    default: PriorityType.VALUE,
  })
  priorityType!: PriorityType;

  @Column({
    name: 'AESTHETIC_OPTION',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  aestheticOption!: string | null;

  @Column({ name: 'SUBTOTAL_PARTS_PRICE', type: 'int', default: 0 })
  subtotalPartsPrice!: number;

  @Column({ name: 'ASSEMBLY_FEE', type: 'int', default: 0 })
  assemblyFee!: number;

  @Column({ name: 'WINDOWS_FEE', type: 'int', default: 0 })
  windowsFee!: number;

  @Column({ name: 'SHIPPING_FEE', type: 'int', default: 0 })
  shippingFee!: number;

  @Column({ name: 'TOTAL_PRICE', type: 'int', default: 0 })
  totalPrice!: number;

  @Column({ name: 'SNAPSHOT_JSON', type: 'json', nullable: true })
  snapshotJson!: any | null;

  @Column({ name: 'LAST_PRICE_CHECKED_DT', type: 'datetime', nullable: true })
  lastPriceCheckedAt!: Date | null;

  @OneToMany(() => QuoteItem, (item) => item.quote)
  items!: QuoteItem[];

  @OneToMany(() => Order, (order) => order.quote)
  orders!: Order[];

  @CreateDateColumn({ name: 'CREATED_DT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_DT', nullable: true })
  updatedAt!: Date | null;
}
