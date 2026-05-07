import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ss_organizaciones', { schema: 'servicio_social' })
export class SsOrganizacionesEntity {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nombre_organizacion: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nombre_titular_organizacion: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  puesto_titular_organizaciones: string;

}