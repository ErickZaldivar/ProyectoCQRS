import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ISsPermisosRepository } from '../../../../domain/interfaces/servicio_social/ss_permisos.interface';

@Injectable()
export class EliminarSsPermisosUseCase {
  constructor(
    @Inject('ISsPermisosRepository')
    private readonly ssPermisosRepository: ISsPermisosRepository,
  ) {}

  async Ejecutar(id: number): Promise<void> {
    const permisoExistente = await this.ssPermisosRepository.ObtenerPorId(id);
    
    if (!permisoExistente) {
      throw new NotFoundException(`No se encontró el permiso con el id ${id}`);
    }

    await this.ssPermisosRepository.Eliminar(id);
  }
}