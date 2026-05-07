import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ISsRolesPermisosRepository } from '../../../../domain/interfaces/servicio_social/ss_roles_permisos.interface';

@Injectable()
export class EliminarSsRolesPermisosUseCase {
  constructor(
    @Inject('ISsRolesPermisosRepository')
    private readonly ssRolesPermisosRepository: ISsRolesPermisosRepository,
  ) {}

  async Ejecutar(id: number): Promise<void> {
    const asignacionExistente = await this.ssRolesPermisosRepository.ObtenerPorId(id);
    
    if (!asignacionExistente) {
      throw new NotFoundException(`No se encontró la asignación de rol-permiso con el id ${id}`);
    }
    await this.ssRolesPermisosRepository.Eliminar(id);
  }
}