import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ISsRolesRepository } from '../../../../domain/interfaces/servicio_social/ss_roles.interface';
import { SsRoles } from '../../../../dtos/POCOS/servicio_social/ss_roles.poco';

@Injectable()
export class ObtenerSsRoles {

  constructor(
    @Inject('ISsRolesRepository')
    private readonly ssRolesRepository: ISsRolesRepository,
  ) {}

  async ObtenerTodos(): Promise<SsRoles[]> {
    const roles = await this.ssRolesRepository.ObtenerTodos();

    if (!roles || roles.length === 0) {
      throw new NotFoundException('No se encontraron roles');
    }

    return roles;
  }

  async ObtenerPorId(id: number): Promise<SsRoles> {
    const rol = await this.ssRolesRepository.ObtenerPorId(id);

    if (!rol) {
      throw new NotFoundException(`No se encontró el rol con id ${id}`);
    }

    return rol;
  }

  async ObtenerPorNombreRol(nombreRol: string): Promise<SsRoles[]> {
    const roles = await this.ssRolesRepository.ObtenerPorNombreRol(nombreRol);

    if (!roles || roles.length === 0) {
      throw new NotFoundException(`No se encontraron roles con el nombre ${nombreRol}`);
    }

    return roles;
  }

}