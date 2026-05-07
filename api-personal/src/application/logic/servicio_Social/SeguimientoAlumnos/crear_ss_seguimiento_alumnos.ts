import { Injectable, Inject } from '@nestjs/common';
import { ISsSeguimientoAlumnosRepository } from '../../../../domain/interfaces/servicio_social/ss_seguimiento_alumnos.interface';
import { CrearSsSeguimientoAlumnosDto } from '../../../../dtos/requests/Servicio Social/SeguimientoAlumnos/crear_ss_seguimiento_alumnos.dto';
import { SsSeguimientoAlumnosPoco } from '../../../../dtos/POCOS/servicio_social/ss_seguimiento_alumnos.poco';

@Injectable()
export class CrearSsSeguimientoAlumnosUseCase {
  constructor(
    @Inject('ISsSeguimientoAlumnosRepository')
    private readonly seguimientoAlumnosRepository: ISsSeguimientoAlumnosRepository,
  ) {}

  async Ejecutar(dto: CrearSsSeguimientoAlumnosDto): Promise<SsSeguimientoAlumnosPoco> {
    return this.seguimientoAlumnosRepository.Crear(dto);
  }
}