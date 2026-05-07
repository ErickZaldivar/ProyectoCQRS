import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SsPermisosEntity } from '../../bd/entities/servicio_social/ss_permisos.entity';
import { SsPermisosRepository } from '../../bd/repositories/servicio_social/ss_permisos.repository';
import { SsPermisosController } from '../../../application/controllers/servicio_social/ss_permisos.controller';
import { ObtenerSsPermisos } from '../../../application/logic/servicio_Social/Permisos/obtener_ss_permisos';
import { CrearSsPermisosUseCase } from '../../../application/logic/servicio_Social/Permisos/crear_ss_permisos';
import { EliminarSsPermisosUseCase } from '../../../application/logic/servicio_Social/Permisos/eliminar_ss_permisos';
import { ActualizarSsPermisosUseCase } from '../../../application/logic/servicio_Social/Permisos/actualizar_ss_permisos';

@Module({
  imports: [
    // ✅ Registrar en ambos DataSources
    TypeOrmModule.forFeature([SsPermisosEntity], 'DB_PRINCIPAL'),
    TypeOrmModule.forFeature([SsPermisosEntity], 'DB_REPLICA'),
  ],

  providers: [
    ObtenerSsPermisos,
    CrearSsPermisosUseCase,
    EliminarSsPermisosUseCase,
    ActualizarSsPermisosUseCase,
    {
      provide: 'ISsPermisosRepository',
      useClass: SsPermisosRepository,
    },
  ],

  controllers: [
    SsPermisosController,
  ],

  exports: [
    ObtenerSsPermisos,
  ],
})
export class SsPermisosModule {}