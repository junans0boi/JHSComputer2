import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentMethod, PaymentStatus } from '../common/enums';
import { User } from '../users/user.entity';
import { Order } from './order.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ name: 'order_id', type: 'bigint' })
  orderId!: string;

  @ManyToOne(() => Order, (order) => order.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order!: Order;

  @Column({ type: 'enum', enum: PaymentMethod, default: PaymentMethod.BANK_TRANSFER })
  method!: PaymentMethod;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status!: PaymentStatus;

  @Column({ type: 'int' })
  amount!: number;

  @Column({ name: 'depositor_name', type: 'varchar', length: 80, nullable: true })
  depositorName!: string | null;

  @Column({ name: 'confirmed_by_user_id', type: 'bigint', nullable: true })
  confirmedByUserId!: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'confirmed_by_user_id' })
  confirmedByUser!: User | null;

  @Column({ name: 'confirmed_at', type: 'datetime', nullable: true })
  confirmedAt!: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  memo!: string | null;
}
