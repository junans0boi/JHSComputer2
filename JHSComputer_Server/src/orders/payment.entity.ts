import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentMethod, PaymentStatus } from '../common/enums';
import { User } from '../users/user.entity';
import { Order } from './order.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('increment', { name: 'PAYMENT_ID', type: 'bigint' })
  id!: string;

  @Column({ name: 'ORDER_ID', type: 'bigint' })
  orderId!: string;

  @ManyToOne(() => Order, (order) => order.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ORDER_ID' })
  order!: Order;

  @Column({ name: 'METHOD', type: 'varchar', length: 30, default: PaymentMethod.BANK_TRANSFER })
  method!: PaymentMethod;

  @Column({ name: 'STATUS', type: 'varchar', length: 30, default: PaymentStatus.PENDING })
  status!: PaymentStatus;

  @Column({ name: 'AMOUNT', type: 'int', default: 0 })
  amount!: number;

  @Column({ name: 'DEPOSITOR_NAME', type: 'varchar', length: 80, nullable: true })
  depositorName!: string | null;

  @Column({ name: 'CONFIRMED_BY_USER_ID', type: 'bigint', nullable: true })
  confirmedByUserId!: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'CONFIRMED_BY_USER_ID' })
  confirmedByUser!: User | null;

  @Column({ name: 'CONFIRMED_DT', type: 'datetime', nullable: true })
  confirmedDt!: Date | null;

  @Column({ name: 'MEMO', type: 'varchar', length: 255, nullable: true })
  memo!: string | null;
}
