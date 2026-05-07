import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ss_permisos', { schema: 'servicio_social' })
export class SsPermisosEntity {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  permiso: string;
  descripcion: string;

}