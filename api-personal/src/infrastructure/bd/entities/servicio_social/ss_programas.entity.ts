import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ss_programas', { schema: 'servicio_social' })
export class SsProgramasEntity {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  id_organizacion: number;

  @Column({ type: 'bigint' })
  id_tipo_programa: number;

  @Column({ type: 'varchar', length: 255 })
  nombre_programa: string;

  @Column({ type: 'boolean', nullable: true })
  modalidad: boolean;

  @Column({ type: 'date', nullable: true })
  fecha_inicio_servicio: Date;

  @Column({ type: 'date', nullable: true })
  fecha_fin_servicio: Date;

  @Column({ type: 'varchar', length: 300 })
  lista_actividades: string;

  @Column({ type: 'bytea', nullable: true })
  plan_trabajo: Buffer;

}