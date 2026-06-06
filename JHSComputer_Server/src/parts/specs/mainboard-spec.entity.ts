import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Part } from '../part.entity';
import { BooleanTransformer } from '../../common/transformers';

@Entity('mainboard_specs')
export class MainboardSpec {
  @PrimaryColumn({ name: 'PART_ID', type: 'bigint' })
  id!: string;

  @OneToOne(() => Part, (part) => part.mainboardSpec, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'PART_ID' })
  part!: Part;

  @Column({ name: 'SOCKET', type: 'varchar', length: 50 })
  socket!: string;

  @Column({ name: 'CHIPSET', type: 'varchar', length: 100, nullable: true })
  chipset!: string | null;

  @Column({ name: 'FORM_FACTOR', type: 'varchar', length: 50, nullable: true })
  formFactor!: string | null;

  @Column({ name: 'MEMORY_TYPE', type: 'varchar', length: 50, nullable: true })
  memoryType!: string | null;

  @Column({ name: 'MEMORY_SLOT_COUNT', type: 'int', nullable: true })
  memorySlotCount!: number | null;

  @Column({ name: 'MAX_MEMORY_GB', type: 'int', nullable: true })
  maxMemoryGb!: number | null;

  @Column({ name: 'M2_SLOT_COUNT', type: 'int', nullable: true })
  m2SlotCount!: number | null;

  @Column({ name: 'SATA_PORT_COUNT', type: 'int', nullable: true })
  sataPortCount!: number | null;

  @Column({ name: 'PCIE_X16_SLOT_COUNT', type: 'int', nullable: true })
  pcieX16SlotCount!: number | null;

  @Column({
    name: 'WIFI_BUILTIN',
    type: 'char',
    length: 1,
    nullable: true,
    transformer: BooleanTransformer,
  })
  wifiBuiltin!: boolean | null;

  @UpdateDateColumn({ name: 'UPDATED_DT' })
  updatedAt!: Date;
}
