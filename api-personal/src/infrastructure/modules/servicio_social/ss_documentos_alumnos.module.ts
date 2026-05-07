import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { SsDocumentosAlumnosEntity } from '../../bd/entities/servicio_social/ss_documentos_alumnos.entity';
import { SsDocumentosAlumnosController } from '../../../application/controllers/servicio_social/ss_documentos_alumnos.controller';
import { ObtenerSsDocumentosAlumnos } from '../../../application/logic/servicio_Social/DocumentosAlumnos/obtener_ss_documentos_alumnos';
import { CrearSsDocumentosAlumnosUseCase } from '../../../application/logic/servicio_Social/DocumentosAlumnos/crear_ss_documentos_alumnos';
import { SsDocumentosAlumnosRepository } from '../../bd/repositories/servicio_social/ss_documentos_alumnos.repository';
import { EliminarSsDocumentosAlumnosUseCase } from '../../../application/logic/servicio_Social/DocumentosAlumnos/eliminar_ss_documentos_alumnos';
import { ActualizarSsDocumentosAlumnosUseCase } from '../../../application/logic/servicio_Social/DocumentosAlumnos/actualizar_ss_documentos_alumnos.use.case';
import { LimpiarCampoSsDocumentosAlumnosUseCase } from '../../../application/logic/servicio_Social/DocumentosAlumnos/limpiar_campo_ss_documentos_alumnos';
import { SsDocumentoReplicacionAdapter } from '../../external_apis/ss_documentos_replicacion.adapter';
import { SS_DOCUMENTO_REPLICACION_PORT } from '../../../domain/interfaces/servicio_social/ss_documento_replicacion.port';

@Module({
  imports: [
    TypeOrmModule.forFeature([SsDocumentosAlumnosEntity], 'DB_PRINCIPAL'),
    TypeOrmModule.forFeature([SsDocumentosAlumnosEntity], 'DB_REPLICA'),
    HttpModule,
  ],
  controllers: [SsDocumentosAlumnosController],
  providers: [
    ObtenerSsDocumentosAlumnos,
    CrearSsDocumentosAlumnosUseCase,
    EliminarSsDocumentosAlumnosUseCase,
    ActualizarSsDocumentosAlumnosUseCase,
    LimpiarCampoSsDocumentosAlumnosUseCase, // 🆕
    {
      provide: 'ISsDocumentosAlumnosRepository',
      useClass: SsDocumentosAlumnosRepository,
    },
    {
      provide: SS_DOCUMENTO_REPLICACION_PORT,
      useClass: SsDocumentoReplicacionAdapter,
    },
  ],
})
export class SsDocumentosAlumnosModule {}