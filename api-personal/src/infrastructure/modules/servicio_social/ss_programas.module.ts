import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SsProgramasEntity } from '../../bd/entities/servicio_social/ss_programas.entity';
import { SsOrganizacionesEntity } from '../../bd/entities/servicio_social/ss_organizaciones.entity';
import { SsTiposProgramasEntity } from '../../bd/entities/servicio_social/ss_tipos_programas.entity';
import { SsProgramasRepository } from '../../bd/repositories/servicio_social/ss_programas.repository';
import { SsProgramasController } from '../../../application/controllers/servicio_social/ss_programas.controller';
import { ObtenerSsProgramas } from '../../../application/logic/servicio_Social/Programas/obtemer_ss_programas';
import { CrearSsProgramaUseCase } from '../../../application/logic/servicio_Social/Programas/crear_ss_programas';
import { EliminarSsProgramasUseCase} from '../../../application/logic/servicio_Social/Programas/eliminar_ss_programas';
import { ActualizarSsProgramaUseCase } from '../../../application/logic/servicio_Social/Programas/actualizar_ss_programas';

@Module({
  imports: [
    // ✅ Registrar en ambos DataSources
    TypeOrmModule.forFeature([SsProgramasEntity], 'DB_PRINCIPAL'),
    TypeOrmModule.forFeature([SsProgramasEntity], 'DB_REPLICA'),
  ],

  providers: [
    ObtenerSsProgramas,
    CrearSsProgramaUseCase,
    EliminarSsProgramasUseCase,
    ActualizarSsProgramaUseCase,
    {
      provide: 'ISsProgramasRepository',
      useClass: SsProgramasRepository,
    },
  ],

  controllers: [
    SsProgramasController
  ],

  exports: [
    ObtenerSsProgramas,
    CrearSsProgramaUseCase,
    EliminarSsProgramasUseCase,
  ],
})
export class SsProgramasModule {}