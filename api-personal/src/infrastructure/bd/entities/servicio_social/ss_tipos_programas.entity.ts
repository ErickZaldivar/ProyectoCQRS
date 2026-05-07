import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ss_tipos_programas', { schema: 'servicio_social' })
export class SsTiposProgramasEntity {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre_tipo: string;

}