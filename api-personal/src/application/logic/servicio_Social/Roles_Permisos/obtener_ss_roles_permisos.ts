import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ISsRolesPermisosRepository } from '../../../../domain/interfaces/servicio_social/ss_roles_permisos.interface';
import { SsRolesPermisos } from '../../../../dtos/POCOS/servicio_social/ss_roles_permisos.poco';

@Injectable()
export class ObtenerSsRolesPermisosUseCase {

  constructor(
    @Inject('ISsRolesPermisosRepository')
    private readonly ssRolesPermisosRepository: ISsRolesPermisosRepository,
  ) {}

  async ObtenerTodos(): Promise<SsRolesPermisos[]> {
    const rolesPermisos = await this.ssRolesPermisosRepository.ObtenerTodos();

    if (!rolesPermisos || rolesPermisos.length === 0) {
      throw new NotFoundException('No se encontraron roles con permisos');
    }

    return rolesPermisos;
  }

  async ObtenerPorId(id: number): Promise<SsRolesPermisos> {
    const rolPermiso = await this.ssRolesPermisosRepository.ObtenerPorId(id);

    if (!rolPermiso) {
      throw new NotFoundException(`No se encontró el rol-permiso con id ${id}`);
    }

    return rolPermiso;
  }

  async ObtenerPorRol(idRol: number): Promise<SsRolesPermisos[]> {
    const rolesPermisos = await this.ssRolesPermisosRepository.ObtenerPorRol(idRol);

    if (!rolesPermisos || rolesPermisos.length === 0) {
      throw new NotFoundException(`No se encontraron permisos para el rol con id ${idRol}`);
    }

    return rolesPermisos;
  }

  async ObtenerPorPermiso(idPermiso: number): Promise<SsRolesPermisos[]> {
    const rolesPermisos = await this.ssRolesPermisosRepository.ObtenerPorPermiso(idPermiso);

    if (!rolesPermisos || rolesPermisos.length === 0) {
      throw new NotFoundException(`No se encontraron roles para el permiso con id ${idPermiso}`);
    }

    return rolesPermisos;
  }

}