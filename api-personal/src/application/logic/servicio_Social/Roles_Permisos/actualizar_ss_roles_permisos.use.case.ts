import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { ISsRolesPermisosRepository } from '../../../../domain/interfaces/servicio_social/ss_roles_permisos.interface';
import { ActualizarSsRolPermisoDto } from '../../../../dtos/requests/Servicio Social/Roles_Permisos/actualizar_ss_roles_permisos.dto';
import { SsRolesPermisos } from '../../../../dtos/POCOS/servicio_social/ss_roles_permisos.poco';

@Injectable()
export class ActualizarSsRolPermisoUseCase {

  constructor(
    @Inject('ISsRolesPermisosRepository')
    private readonly ssRolesPermisosRepository: ISsRolesPermisosRepository,
  ) {}

  async Ejecutar(id: number, dto: ActualizarSsRolPermisoDto): Promise<SsRolesPermisos> {
    // 1. Verificar que la asignación exista
    const asignacionExistente = await this.ssRolesPermisosRepository.ObtenerPorId(id);

    if (!asignacionExistente) {
      throw new NotFoundException(`No se encontró la asignación rol-permiso con id ${id}`);
    }

    // 2. Determinar los IDs finales (actuales o nuevos)
    const nuevoIdRol = dto.id_ss_rol !== undefined ? dto.id_ss_rol : asignacionExistente.idSsRol;
    const nuevoIdPermiso = dto.id_ss_permiso !== undefined ? dto.id_ss_permiso : asignacionExistente.idSsPermiso;

    // 3. Si cambia rol o permiso, verificar que no exista duplicado (misma combinación)
    if (dto.id_ss_rol !== undefined || dto.id_ss_permiso !== undefined) {
      const asignacionesExistentes = await this.ssRolesPermisosRepository.ObtenerPorRol(nuevoIdRol);
      
      const existeDuplicado = asignacionesExistentes.some(
        asignacion => asignacion.idSsPermiso === nuevoIdPermiso && asignacion.id !== id
      );

      if (existeDuplicado) {
        throw new ConflictException(
          `El rol con id ${nuevoIdRol} ya tiene asignado el permiso con id ${nuevoIdPermiso}`
        );
      }
    }

    // 4. Actualizar
    return this.ssRolesPermisosRepository.Actualizar(id, dto);
  }
}