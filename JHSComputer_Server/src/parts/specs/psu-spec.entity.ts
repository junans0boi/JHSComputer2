import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Part } from '../part.entity';
import { BooleanTransformer } from '../../common/transformers';

@Entity('psu_specs')
export class PsuSpec {
  @PrimaryColumn({ name: 'PART_ID', type: 'bigint' })
  id!: string;

  @OneToOne(() => Part, (part) => part.psuSpec, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'PART_ID' })
  part!: Part;

  @Column({ name: 'FORM_FACTOR', type: 'varchar', length: 50, nullable: true })
  formFactor!: string | null;

  @Column({ name: 'RATED_WATTAGE', type: 'int' })
  ratedWattage!: number;

  @Column({ name: 'CERTIFICATION', type: 'varchar', length: 80, nullable: true })
  certification!: string | null;

  @Column({ name: 'MODULAR_TYPE', type: 'varchar', length: 50, nullable: true })
  modularType!: string | null;

  @Column({
    name: 'PCIE_5_READY',
    type: 'char',
    length: 1,
    nullable: true,
    transformer: BooleanTransformer,
  })
  pcie5Ready!: boolean | null;

  @Column({ name: 'CONNECTOR_JSON', type: 'json', nullable: true })
  connectorJson!: any | null;

  @UpdateDateColumn({ name: 'UPDATED_DT' })
  updatedAt!: Date;
}
