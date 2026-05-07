import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ISsOrganizacionesRepository } from '../../../../domain/interfaces/servicio_social/ss_organizaciones';

@Injectable()
export class EliminarSsOrganizacionUseCase {
  constructor(
    @Inject('ISsOrganizacionesRepository')
    private readonly ssOrganizacionesRepository: ISsOrganizacionesRepository,
  ) {}

  async EliminarPorId(id: number): Promise<void> {
    const affected = await this.ssOrganizacionesRepository.Eliminar(id);

    if (affected === 0) {
      throw new NotFoundException(
        `No se encontró la organización con id ${id}`,
      );
    }
  }

  async EliminarPorNombre(nombre: string): Promise<void> {
    const affected =
      await this.ssOrganizacionesRepository.EliminarPorNombre(nombre);

    if (affected === 0) {
      throw new NotFoundException(
        `No se encontró ninguna organización con el nombre ${nombre}`,
      );
    }
  }
}