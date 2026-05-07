import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SsTiposProgramasEntity } from '../../bd/entities/servicio_social/ss_tipos_programas.entity';
import { SsTiposProgramasRepository } from '../../bd/repositories/servicio_social/ss_tipos_programas.repository';
import { SsTiposProgramasController } from '../../../application/controllers/servicio_social/ss_tipos_programas.controlelr';
import { ObtenerSsTiposProgramas } from '../../../application/logic/servicio_Social/Tipos_Programas/obtener_ss_tipos_programas';
import { CrearSsTipoProgramaUseCase } from '../../../application/logic/servicio_Social/Tipos_Programas/crear_ss_tipos_programas';
import { EliminarSsTipoProgramaUseCase } from '../../../application/logic/servicio_Social/Tipos_Programas/eliminar_tipos_programas';
import { ActualizarSsTipoProgramaUseCase } from '../../../application/logic/servicio_Social/Tipos_Programas/actualizar_ss_tipos_programas.use.case';

@Module({
  imports: [
    // ✅ Registrar en ambos DataSources
    TypeOrmModule.forFeature([SsTiposProgramasEntity], 'DB_PRINCIPAL'),
    TypeOrmModule.forFeature([SsTiposProgramasEntity], 'DB_REPLICA'),
  ],

  providers: [
    ObtenerSsTiposProgramas,
    CrearSsTipoProgramaUseCase,
    EliminarSsTipoProgramaUseCase,
    ActualizarSsTipoProgramaUseCase,
    {
      provide: 'ISsTiposProgramasRepository',
      useClass: SsTiposProgramasRepository,
    },
  ],

  controllers: [
    SsTiposProgramasController
  ],

  exports: [
    ObtenerSsTiposProgramas,
    CrearSsTipoProgramaUseCase,
    EliminarSsTipoProgramaUseCase,
  ],
})
export class SsTiposProgramasModule {}