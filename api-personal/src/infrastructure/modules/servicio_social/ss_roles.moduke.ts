import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SsRolesEntity } from '../../bd/entities/servicio_social/ss_roles..entity';
import { SsRolesRepository } from '../../bd/repositories/servicio_social/ss_roles.repository';
import { SsRolesController } from '../../../application/controllers/servicio_social/ss_roles.controller';
import { ObtenerSsRoles } from '../../../application/logic/servicio_Social/Roles/obtener_ss_roles';
import { CrearSsRolesUseCase } from '../../../application/logic/servicio_Social/Roles/crear_ss_roles';
import { EliminarSsRolesUseCase } from '../../../application/logic/servicio_Social/Roles/eliminar_ss_roles';
import { ActualizarSsRolesUseCase } from '../../../application/logic/servicio_Social/Roles/actualizar_ss_roles';

@Module({
  imports: [
    // ✅ Registrar en ambos DataSources
    TypeOrmModule.forFeature([SsRolesEntity], 'DB_PRINCIPAL'),
    TypeOrmModule.forFeature([SsRolesEntity], 'DB_REPLICA'),
  ],

  providers: [
    ObtenerSsRoles,
    CrearSsRolesUseCase,
    EliminarSsRolesUseCase,
    ActualizarSsRolesUseCase,
    {
      provide: 'ISsRolesRepository',
      useClass: SsRolesRepository,
    },
  ],

  controllers: [
    SsRolesController
  ],

  exports: [
    ObtenerSsRoles,
  ],
})
export class SsRolesModule {}