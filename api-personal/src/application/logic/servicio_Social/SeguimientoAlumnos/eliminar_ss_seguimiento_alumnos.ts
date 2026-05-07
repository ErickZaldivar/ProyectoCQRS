import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ISsSeguimientoAlumnosRepository } from '../../../../domain/interfaces/servicio_social/ss_seguimiento_alumnos.interface';

@Injectable()
export class EliminarSsSeguimientoAlumnosUseCase {
  constructor(
    @Inject('ISsSeguimientoAlumnosRepository')
    private readonly seguimientoRepository: ISsSeguimientoAlumnosRepository,
  ) {}

  async Ejecutar(id: number): Promise<void> {
    const registroExistente = await this.seguimientoRepository.ObtenerPorId(id);
    
    if (!registroExistente) {
      throw new NotFoundException(`No se encontró el registro de seguimiento con el id ${id}`);
    }
    await this.seguimientoRepository.Eliminar(id);
  }
}