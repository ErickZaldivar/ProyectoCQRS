import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ISsTiposProgramasRepository } from '../../../../domain/interfaces/servicio_social/ss_tipos_programas.interface';
import { SsTiposProgramas } from '../../../../dtos/POCOS/servicio_social/ss_tipos_programas.poco';

@Injectable()
export class ObtenerSsTiposProgramas {

  constructor(
    @Inject('ISsTiposProgramasRepository')
    private readonly ssTiposProgramasRepository: ISsTiposProgramasRepository,
  ) {}

  async ObtenerTodos(): Promise<SsTiposProgramas[]> {
    const tiposProgramas = await this.ssTiposProgramasRepository.ObtenerTodos();

    if (!tiposProgramas || tiposProgramas.length === 0) {
      throw new NotFoundException('No se encontraron tipos de programas');
    }

    return tiposProgramas;
  }

  async ObtenerPorId(id: number): Promise<SsTiposProgramas> {
    const tipoPrograma = await this.ssTiposProgramasRepository.ObtenerPorId(id);

    if (!tipoPrograma) {
      throw new NotFoundException(`No se encontró el tipo de programa con id ${id}`);
    }

    return tipoPrograma;
  }

  async ObtenerPorNombreTipo(nombreTipo: string): Promise<SsTiposProgramas[]> {
    const tiposProgramas = await this.ssTiposProgramasRepository.ObtenerPorNombreTipo(nombreTipo);

    if (!tiposProgramas || tiposProgramas.length === 0) {
      throw new NotFoundException(`No se encontraron tipos de programas con el nombre ${nombreTipo}`);
    }

    return tiposProgramas;
  }

}