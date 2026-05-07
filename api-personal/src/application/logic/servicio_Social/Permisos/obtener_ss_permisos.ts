import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ISsPermisosRepository } from '../../../../domain/interfaces/servicio_social/ss_permisos.interface';
import { SsPermisos } from '../../../../dtos/POCOS/servicio_social/ss_permisos.poco';

@Injectable()
export class ObtenerSsPermisos {

  constructor(
    @Inject('ISsPermisosRepository')
    private readonly ssPermisosRepository: ISsPermisosRepository,
  ) {}

  async ObtenerTodos(): Promise<SsPermisos[]> {
    const permisos = await this.ssPermisosRepository.ObtenerTodos();

    if (!permisos || permisos.length === 0) {
      throw new NotFoundException('No se encontraron permisos');
    }

    return permisos;
  }

  async ObtenerPorId(id: number): Promise<SsPermisos> {
    const permiso = await this.ssPermisosRepository.ObtenerPorId(id);

    if (!permiso) {
      throw new NotFoundException(`No se encontró el permiso con id ${id}`);
    }

    return permiso;
  }

  async ObtenerPorNombrePermiso(permiso: string): Promise<SsPermisos[]> {
    const permisos = await this.ssPermisosRepository.ObtenerPorNombrePermiso(permiso);

    if (!permisos || permisos.length === 0) {
      throw new NotFoundException(`No se encontraron permisos con el nombre ${permiso}`);
    }

    return permisos;
  }

}