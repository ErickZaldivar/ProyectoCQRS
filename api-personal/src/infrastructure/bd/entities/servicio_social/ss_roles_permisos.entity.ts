import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ss_roles_permisos', { schema: 'servicio_social' })
export class SsRolesPermisosEntity {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  id_ss_rol: number;

  @Column({ type: 'bigint' })
  id_ss_permiso: number;

}