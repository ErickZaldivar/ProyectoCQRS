import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('alumnos_datos_personales', { schema: 'alumnos' })
export class AlumnosDatosPersonalesEntity {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nombre: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  apellido_paterno: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  apellido_materno: string;

}