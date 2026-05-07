import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SsSeguimientoAlumnosEntity } from '../../bd/entities/servicio_social/ss_seguimiento_alumnos.entity';
import { SsSeguimientoAlumnosController } from '../../../application/controllers/servicio_social/ss_seguimiento_alumnos.controller';
import { ObtenerSsSeguimientoAlumnos } from '../../../application/logic/servicio_Social/SeguimientoAlumnos/obtener_ss_seguimiento_alumnos';
import { SsSeguimientoAlumnosRepository } from '../../bd/repositories/servicio_social/ss_seguimiento_alumnos.repository';
import { CrearSsSeguimientoAlumnosUseCase } from '../../../application/logic/servicio_Social/SeguimientoAlumnos/crear_ss_seguimiento_alumnos';
import { EliminarSsSeguimientoAlumnosUseCase } from '../../../application/logic/servicio_Social/SeguimientoAlumnos/eliminar_ss_seguimiento_alumnos';

@Module({
  imports: [
    // ✅ Registrar en ambos DataSources
    TypeOrmModule.forFeature([SsSeguimientoAlumnosEntity], 'DB_PRINCIPAL'),
    TypeOrmModule.forFeature([SsSeguimientoAlumnosEntity], 'DB_REPLICA'),
  ],

  controllers: [SsSeguimientoAlumnosController],

  providers: [
  ObtenerSsSeguimientoAlumnos,
  CrearSsSeguimientoAlumnosUseCase,
  EliminarSsSeguimientoAlumnosUseCase,
  {
    provide: 'ISsSeguimientoAlumnosRepository', 
    useClass: SsSeguimientoAlumnosRepository,
  },
]

})
export class SsSeguimientoAlumnosModule {}