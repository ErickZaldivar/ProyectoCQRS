import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ISsOrganizacionesRepository } from '../../../../domain/interfaces/servicio_social/ss_organizaciones';
import { SsOrganizaciones } from '../../../../dtos/POCOS/servicio_social/ss_organizaciones.poco';

@Injectable()
export class ObtenerSsOrganizaciones {

  constructor(
    @Inject('ISsOrganizacionesRepository')
    private readonly ssOrganizacionesRepository: ISsOrganizacionesRepository,
  ) {}

  async ObtenerTodos(): Promise<SsOrganizaciones[]> {
    const organizaciones = await this.ssOrganizacionesRepository.ObtenerTodos();

    if (!organizaciones || organizaciones.length === 0) {
      throw new NotFoundException('No se encontraron organizaciones');
    }

    return organizaciones;
  }

  async ObtenerPorId(id: number): Promise<SsOrganizaciones> {
    const organizacion = await this.ssOrganizacionesRepository.ObtenerPorId(id);

    if (!organizacion) {
      throw new NotFoundException(`No se encontró la organización con id ${id}`);
    }

    return organizacion;
  }

  async ObtenerPorNombreOrganizacion(nombre: string): Promise<SsOrganizaciones[]> {
    const organizaciones = await this.ssOrganizacionesRepository.ObtenerPorNombreOrganizacion(nombre);

    if (!organizaciones || organizaciones.length === 0) {
      throw new NotFoundException(`No se encontraron organizaciones con el nombre ${nombre}`);
    }

    return organizaciones;
  }

  async ObtenerPorNombreTitular(nombreTitular: string): Promise<SsOrganizaciones[]> {
    const organizaciones = await this.ssOrganizacionesRepository.ObtenerPorNombreTitular(nombreTitular);

    if (!organizaciones || organizaciones.length === 0) {
      throw new NotFoundException(`No se encontraron organizaciones con el titular ${nombreTitular}`);
    }

    return organizaciones;
  }

}