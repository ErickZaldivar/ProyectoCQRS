import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentosService } from './documentos.service';
import { SsDocumentosAlumnosEntity } from './entities/ss_documentos_alumnos.entity';
import { AlumnoDatosAcademicosEntity } from './entities/alumnos_datos_academicos.entity';
import { AlumnosDatosPersonalesEntity } from './entities/alumnos_datos_personales.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SsDocumentosAlumnosEntity,
      AlumnoDatosAcademicosEntity,
      AlumnosDatosPersonalesEntity,
    ]),
  ],
  providers: [DocumentosService],
})
export class DocumentosModule {}