import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Part } from '../part.entity';
import { BooleanTransformer } from '../../common/transformers';

@Entity('cpu_specs')
export class CpuSpec {
  @PrimaryColumn({ name: 'PART_ID', type: 'bigint' })
  id!: string;

  @OneToOne(() => Part, (part) => part.cpuSpec, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'PART_ID' })
  part!: Part;

  @Column({ name: 'SOCKET', type: 'varchar', length: 50 })
  socket!: string;

  @Column({ name: 'FAMILY', type: 'varchar', length: 100, nullable: true })
  family!: string | null;

  @Column({ name: 'GENERATION', type: 'varchar', length: 100, nullable: true })
  generation!: string | null;

  @Column({ name: 'CODENAME', type: 'varchar', length: 100, nullable: true })
  codename!: string | null;

  @Column({ name: 'CORE_COUNT', type: 'int', nullable: true })
  coreCount!: number | null;

  @Column({ name: 'THREAD_COUNT', type: 'int', nullable: true })
  threadCount!: number | null;

  @Column({ name: 'BASE_CLOCK_GHZ', type: 'decimal', precision: 5, scale: 2, nullable: true })
  baseClockGhz!: string | null;

  @Column({ name: 'BOOST_CLOCK_GHZ', type: 'decimal', precision: 5, scale: 2, nullable: true })
  boostClockGhz!: string | null;

  @Column({ name: 'L2_CACHE_MB', type: 'decimal', precision: 8, scale: 2, nullable: true })
  l2CacheMb!: string | null;

  @Column({ name: 'L3_CACHE_MB', type: 'decimal', precision: 8, scale: 2, nullable: true })
  l3CacheMb!: string | null;

  @Column({ name: 'TDP_W', type: 'int', nullable: true })
  tdpW!: number | null;

  @Column({ name: 'PBP_W', type: 'int', nullable: true })
  pbpW!: number | null;

  @Column({ name: 'MTP_W', type: 'int', nullable: true })
  mtpW!: number | null;

  @Column({ name: 'MEMORY_TYPES_JSON', type: 'json', nullable: true })
  memoryTypesJson!: string[] | null;

  @Column({ name: 'PCIE_VERSIONS_JSON', type: 'json', nullable: true })
  pcieVersionsJson!: string[] | null;

  @Column({
    name: 'HAS_INTEGRATED_GRAPHICS',
    type: 'char',
    length: 1,
    nullable: true,
    transformer: BooleanTransformer,
  })
  hasIntegratedGraphics!: boolean | null;

  @Column({ name: 'INTEGRATED_GRAPHICS_NAME', type: 'varchar', length: 120, nullable: true })
  integratedGraphicsName!: string | null;

  @UpdateDateColumn({ name: 'UPDATED_DT' })
  updatedAt!: Date;
}
