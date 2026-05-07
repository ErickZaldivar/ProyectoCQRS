import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlumnoDatosAcademicosEntity } from '../bd/entities/alumnos_datos_academicos.entity';
import { AlumnosDatosPersonalesEntity } from '../bd/entities/aluumnos_datos_personales.entity';
import { CarrerasEntity } from '../bd/entities/carreras.entity';
import { AlumnoDatosAcademicosRepository } from '../bd/repositories/alumnos_datos_academicos.repositiry';

@Module({
  imports: [
    // ✅ Registrar todas las entidades en AMBOS DataSources
    TypeOrmModule.forFeature([
      AlumnoDatosAcademicosEntity,
      AlumnosDatosPersonalesEntity,
      CarrerasEntity,
    ], 'DB_PRINCIPAL'),

    TypeOrmModule.forFeature([
      AlumnoDatosAcademicosEntity,
      AlumnosDatosPersonalesEntity,
      CarrerasEntity,
    ], 'DB_REPLICA'),
  ],

  providers: [
    {
      provide: 'IAlumnoDatosAcademicosRepository',
      useClass: AlumnoDatosAcademicosRepository,
    },
  ],

  exports: [
    'IAlumnoDatosAcademicosRepository',
  ],
})
export class AlumnoDatosAcademicosModule {}