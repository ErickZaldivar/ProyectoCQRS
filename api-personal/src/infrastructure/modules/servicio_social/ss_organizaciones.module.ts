import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SsOrganizacionesEntity } from '../../bd/entities/servicio_social/ss_organizaciones.entity';
import { SsOrganizacionesRepository } from '../../bd/repositories/servicio_social/ss_organizaciones.repository';
import { SsOrganizacionesController } from '../../../application/controllers/servicio_social/ss_organizaaciones.controller';
import { ObtenerSsOrganizaciones } from '../../../application/logic/servicio_Social/Organizaciones/obtener_ss_organizaciones';
import { CrearSsOrganizacionUseCase } from '../../../application/logic/servicio_Social/Organizaciones/crear_ss_organizaciones';
import { EliminarSsOrganizacionUseCase } from '../../../application/logic/servicio_Social/Organizaciones/eliminar_ss_organizaciones';
import { ActualizarSsOrganizacionUseCase } from '../../../application/logic/servicio_Social/Organizaciones/actualizar_organizaciones';

@Module({
  imports: [
    // ✅ Registrar en ambos DataSources
    TypeOrmModule.forFeature([SsOrganizacionesEntity], 'DB_PRINCIPAL'),
    TypeOrmModule.forFeature([SsOrganizacionesEntity], 'DB_REPLICA'),
  ],

  providers: [
    ObtenerSsOrganizaciones,
    CrearSsOrganizacionUseCase,
    EliminarSsOrganizacionUseCase,
    ActualizarSsOrganizacionUseCase,
    {
      provide: 'ISsOrganizacionesRepository',
      useClass: SsOrganizacionesRepository,
    },
  ],

  controllers: [
    SsOrganizacionesController,
  ],

  exports: [
    ObtenerSsOrganizaciones,
    CrearSsOrganizacionUseCase,
    EliminarSsOrganizacionUseCase,
  ],
})
export class SsOrganizacionesModule {}