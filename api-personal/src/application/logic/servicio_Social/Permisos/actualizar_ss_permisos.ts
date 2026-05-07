import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { ISsPermisosRepository } from '../../../../domain/interfaces/servicio_social/ss_permisos.interface';
import { ActualizarSsPermisosDto } from '../../../../dtos/requests/Servicio Social/Permisos/actualizar_ss_permisos.dto';
import { SsPermisos } from '../../../../dtos/POCOS/servicio_social/ss_permisos.poco';

@Injectable()
export class ActualizarSsPermisosUseCase {
  constructor(
    @Inject('ISsPermisosRepository')
    private readonly ssPermisosRepository: ISsPermisosRepository,
  ) {}

  async Ejecutar(id: number, dto: ActualizarSsPermisosDto): Promise<SsPermisos> {
    const permisoExistente = await this.ssPermisosRepository.ObtenerPorId(id);
    if (!permisoExistente) {
      throw new NotFoundException(`No se encontró el permiso con id ${id}`);
    }

    if (dto.permiso) {
      const permisosConMismoNombre = await this.ssPermisosRepository.ObtenerPorNombrePermiso(dto.permiso);
      
      const existeConflicto = permisosConMismoNombre.some(
        (p) => p.permiso.toLowerCase() === dto.permiso!.toLowerCase() && p.id !== id
      );

      if (existeConflicto) {
        throw new ConflictException(`Ya existe un permiso registrado con el nombre '${dto.permiso}'`);
      }
    }

    return this.ssPermisosRepository.Actualizar(id, dto);
  }
}