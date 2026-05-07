import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { ISsRolesPermisosRepository } from '../../../../domain/interfaces/servicio_social/ss_roles_permisos.interface';
import { CrearSsRolPermisoDto } from '../../../../dtos/requests/Servicio Social/Roles_Permisos/crear_ss_roles_permisos.dto';
import { SsRolesPermisos } from '../../../../dtos/POCOS/servicio_social/ss_roles_permisos.poco';

@Injectable()
export class CrearSsRolPermisoUseCase {

  constructor(
    @Inject('ISsRolesPermisosRepository')
    private readonly ssRolesPermisosRepository: ISsRolesPermisosRepository,
  ) {}

  async Ejecutar(dto: CrearSsRolPermisoDto): Promise<SsRolesPermisos> {

    const permisosExistentes = await this.ssRolesPermisosRepository
      .ObtenerPorRol(dto.id_ss_rol);

    const existeRelacion = permisosExistentes.some(
      rp => rp.idSsPermiso === dto.id_ss_permiso
    );

    if (existeRelacion) {
      throw new ConflictException(
        `El rol con id ${dto.id_ss_rol} ya tiene asignado el permiso con id ${dto.id_ss_permiso}`
      );
    }

    return this.ssRolesPermisosRepository.Crear(dto);
  }

}