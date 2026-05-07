import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ISsProgramasRepository } from '../../../../domain/interfaces/servicio_social/ss_programas.interface';

@Injectable()
export class EliminarSsProgramasUseCase {
  constructor(
    @Inject('ISsProgramasRepository')
    private readonly ssProgramasRepository: ISsProgramasRepository,
  ) {}

  async Ejecutar(id: number): Promise<void> {
    const programaExistente = await this.ssProgramasRepository.ObtenerPorId(id);
    
    if (!programaExistente) {
      throw new NotFoundException(`No se encontró el programa con el id ${id}`);
    }
    await this.ssProgramasRepository.Eliminar(id);
  }
}