import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SsRolesPermisosEntity } from '../../bd/entities/servicio_social/ss_roles_permisos.entity';
import { SsRolesEntity } from '../../bd/entities/servicio_social/ss_roles..entity';
import { SsPermisosEntity } from '../../bd/entities/servicio_social/ss_permisos.entity';
import { SsRolesPermisosRepository } from '../../bd/repositories/servicio_social/ss_roles_permisos.repository';
import { SsRolesPermisosController } from '../../../application/controllers/servicio_social/ss_roles_permisos.controller';
import { ObtenerSsRolesPermisosUseCase } from '../../../application/logic/servicio_Social/Roles_Permisos/obtener_ss_roles_permisos';
import { CrearSsRolPermisoUseCase } from '../../../application/logic/servicio_Social/Roles_Permisos/craer_ss_roles_permisos';
import { EliminarSsRolesPermisosUseCase } from '../../../application/logic/servicio_Social/Roles_Permisos/eliminar_ss_roles_permisos';
import { ActualizarSsRolPermisoUseCase } from '../../../application/logic/servicio_Social/Roles_Permisos/actualizar_ss_roles_permisos.use.case';

@Module({
  imports: [
    // ✅ Registrar en ambos DataSources
    TypeOrmModule.forFeature([SsRolesPermisosEntity], 'DB_PRINCIPAL'),
    TypeOrmModule.forFeature([SsRolesPermisosEntity], 'DB_REPLICA'),
  ],

  providers: [
    ObtenerSsRolesPermisosUseCase,
    CrearSsRolPermisoUseCase,
    EliminarSsRolesPermisosUseCase,
    ActualizarSsRolPermisoUseCase,
    {
      provide: 'ISsRolesPermisosRepository',
      useClass: SsRolesPermisosRepository,
    },
  ],

  controllers: [
    SsRolesPermisosController
  ],

  exports: [
    ObtenerSsRolesPermisosUseCase,
    CrearSsRolPermisoUseCase,
  ],
})
export class SsRolesPermisosModule {}