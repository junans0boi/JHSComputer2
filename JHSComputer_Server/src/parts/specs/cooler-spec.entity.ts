import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Part } from '../part.entity';

@Entity('cooler_specs')
export class CoolerSpec {
  @PrimaryColumn({ name: 'PART_ID', type: 'bigint' })
  id!: string;

  @OneToOne(() => Part, (part) => part.coolerSpec, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'PART_ID' })
  part!: Part;

  @Column({ name: 'COOLER_TYPE', type: 'varchar', length: 30 })
  coolerType!: string;

  @Column({ name: 'COLOR', type: 'varchar', length: 50, nullable: true })
  color!: string | null;

  @Column({ name: 'SUPPORTED_SOCKETS_JSON', type: 'json', nullable: true })
  supportedSocketsJson!: string[] | null;

  @Column({ name: 'HEIGHT_MM', type: 'decimal', precision: 8, scale: 2, nullable: true })
  heightMm!: string | null;

  @Column({ name: 'FAN_SIZE_MM', type: 'int', nullable: true })
  fanSizeMm!: number | null;

  @Column({ name: 'TDP_RATING_W', type: 'int', nullable: true })
  tdpRatingW!: number | null;

  @UpdateDateColumn({ name: 'UPDATED_DT' })
  updatedAt!: Date;
}
