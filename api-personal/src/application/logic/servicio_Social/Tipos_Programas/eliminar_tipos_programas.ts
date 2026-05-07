import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ISsTiposProgramasRepository } from '../../../../domain/interfaces/servicio_social/ss_tipos_programas.interface';

@Injectable()
export class EliminarSsTipoProgramaUseCase {

  constructor(
    @Inject('ISsTiposProgramasRepository')
    private readonly ssTiposProgramasRepository: ISsTiposProgramasRepository,
  ) {}

  async EliminarPorId(id: number): Promise<void> {
    const tipoPrograma = await this.ssTiposProgramasRepository.ObtenerPorId(id);

    if (!tipoPrograma) {
      throw new NotFoundException(`No se encontró el tipo de programa con id ${id}`);
    }

    await this.ssTiposProgramasRepository.Eliminar(id);
  }

  async EliminarPorNombre(nombreTipo: string): Promise<void> {
    const tiposProgramas = await this.ssTiposProgramasRepository
      .ObtenerPorNombreTipo(nombreTipo);

    if (!tiposProgramas || tiposProgramas.length === 0) {
      throw new NotFoundException(`No se encontró ningún tipo de programa con el nombre ${nombreTipo}`);
    }

    await this.ssTiposProgramasRepository.EliminarPorNombre(nombreTipo);
  }

}