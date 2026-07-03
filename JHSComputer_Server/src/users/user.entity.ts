import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from '../orders/order.entity';
import { Quote } from '../quotes/quote.entity';
import { UserRole, UserStatus } from '../common/enums';
import { SocialAccount } from './social-account.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'USER_ID' })
  id!: string;

  @Column({ name: 'EMAIL', type: 'varchar', length: 100, nullable: true })
  email!: string | null;

  @Column({ name: 'LOGIN_ID', type: 'varchar', length: 50, nullable: true })
  loginId!: string | null;

  @Column({ name: 'PASSWORD_TEXT', type: 'varchar', length: 100, nullable: true, select: false })
  passwordText!: string | null;

  @Column({ name: 'USER_NAME', type: 'varchar', length: 100 })
  name!: string;

  @Column({ name: 'NICKNAME', type: 'varchar', length: 100, nullable: true })
  nickname!: string | null;

  @Column({ name: 'PHONE', type: 'varchar', length: 20, nullable: true })
  phone!: string | null;

  @Column({
    name: 'ROLE',
    type: 'varchar',
    length: 20,
    default: UserRole.USER,
  })
  role!: UserRole;

  @Column({
    name: 'STATUS',
    type: 'varchar',
    length: 20,
    default: UserStatus.ACTIVE,
  })
  status!: UserStatus;

  @OneToMany(() => SocialAccount, (socialAccount) => socialAccount.user)
  socialAccounts!: SocialAccount[];

  @OneToMany(() => Quote, (quote) => quote.user)
  quotes!: Quote[];

  @OneToMany(() => Order, (order) => order.user)
  orders!: Order[];

  @CreateDateColumn({ name: 'CREATED_DT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_DT', nullable: true })
  updatedAt!: Date | null;

  @DeleteDateColumn({ name: 'DELETED_DT', nullable: true })
  deletedAt!: Date | null;
}
