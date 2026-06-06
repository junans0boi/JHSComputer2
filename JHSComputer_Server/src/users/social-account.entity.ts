import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { SocialProvider } from '../common/enums';
import { User } from './user.entity';

@Entity('social_accounts')
@Unique(['provider', 'providerUserId'])
export class SocialAccount {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'SOCIAL_ACCOUNT_ID' })
  id!: string;

  @Column({ name: 'USER_ID', type: 'bigint' })
  userId!: string;

  @ManyToOne(() => User, (user) => user.socialAccounts, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'USER_ID' })
  user!: User;

  @Column({ name: 'PROVIDER', type: 'varchar', length: 20 })
  provider!: SocialProvider;

  @Column({ name: 'PROVIDER_USER_ID', type: 'varchar', length: 100 })
  providerUserId!: string;

  @Column({ name: 'EMAIL', type: 'varchar', length: 100, nullable: true })
  email!: string | null;

  @Column({ name: 'PROFILE_JSON', type: 'json', nullable: true })
  profileJson!: Record<string, unknown> | null;

  @CreateDateColumn({ name: 'CREATED_DT' })
  createdAt!: Date;
}
