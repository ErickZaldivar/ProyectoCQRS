import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ss_seguimiento_alumnos', schema: 'servicio_social' })
export class SsSeguimientoAlumnosEntity {
    
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', name: 'id_alumno_academico' })
  id_alumno_academico: number;

  @Column({ type: 'bigint', name: 'id_programa' })
  id_programa: number;

  @Column({ type: 'bigint', name: 'id_periodo_escolar' })
  id_periodo_escolar: number;
}