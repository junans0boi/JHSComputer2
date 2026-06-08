import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { BooleanTransformer } from '../common/transformers';

@Entity('common_codes')
export class CommonCode {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'COMMON_CODE_ID' })
  id!: string;

  @Column({ name: 'CODE_GROUP', type: 'varchar', length: 80 })
  group!: string;

  @Column({ name: 'CODE', type: 'varchar', length: 120 })
  code!: string;

  @Column({ name: 'CODE_NAME', type: 'varchar', length: 150 })
  name!: string;

  @Column({ name: 'CODE_NAME_KO', type: 'varchar', length: 150, nullable: true })
  nameKo!: string | null;

  @Column({ name: 'DESCRIPTION', type: 'varchar', length: 500, nullable: true })
  description!: string | null;

  @Column({ name: 'SORT_ORDER', type: 'int', default: 0 })
  sortOrder!: number;

  @Column({
    name: 'IS_ACTIVE',
    type: 'char',
    length: 1,
    default: 'Y',
    transformer: BooleanTransformer,
  })
  isActive!: boolean;

  @Column({ name: 'ATTRIBUTES_JSON', type: 'json', nullable: true })
  attributes!: Record<string, unknown> | null;

  @CreateDateColumn({ name: 'CREATED_DT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_DT', nullable: true })
  updatedAt!: Date | null;
}
