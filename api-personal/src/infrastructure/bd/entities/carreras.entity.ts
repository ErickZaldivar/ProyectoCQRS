import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('carreras', { schema: 'catalogos' })
export class CarrerasEntity {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 80, nullable: true })
  nombre_completo: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  nombre_reducido: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  siglas: string;

}