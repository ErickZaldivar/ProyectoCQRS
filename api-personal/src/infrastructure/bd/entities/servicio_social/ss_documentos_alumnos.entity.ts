import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ss_documentos_alumnos', schema: 'servicio_social' })
export class SsDocumentosAlumnosEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', name: 'id_alumno_academico' })
  id_alumno_academico: number;

  @Column({ type: 'bigint', name: 'id_plan_trabajo' })
  id_plan_trabajo: number;

  @Column({ type: 'bytea', nullable: true })
  carta_presentacion: Buffer;

  @Column({ type: 'bytea', nullable: true })
  carta_compromiso: Buffer;

  @Column({ type: 'bytea', nullable: true })
  carta_aceptacion: Buffer;

  @Column({ type: 'bytea', nullable: true })
  seguro_facultativo: Buffer;
}