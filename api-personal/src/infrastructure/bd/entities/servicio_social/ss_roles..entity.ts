import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ss_roles', { schema: 'servicio_social' })
export class SsRolesEntity {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  rol: string;

}