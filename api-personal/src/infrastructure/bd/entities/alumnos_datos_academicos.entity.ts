import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
//
@Entity('alumnos_datos_academicos', { schema: 'alumnos' })
export class AlumnoDatosAcademicosEntity {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  id_alumno_personal: number;

  @Column({ type: 'bigint', nullable: true })
  id_carrera: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  no_control: string;

  @Column({ type: 'int', nullable: true })
  nip: number;

  @Column({ type: 'int', nullable: true })
  creditos_aprobados: number;

}