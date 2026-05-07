import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { ISsRolesRepository } from '../../../../domain/interfaces/servicio_social/ss_roles.interface';
import { ActualizarSsRolesDto } from '../../../../dtos/requests/Servicio Social/Roles/actualizar_ss_roles.dto';
import { SsRoles } from '../../../../dtos/POCOS/servicio_social/ss_roles.poco';

@Injectable()
export class ActualizarSsRolesUseCase {

  constructor(
    @Inject('ISsRolesRepository')
    private readonly ssRolesRepository: ISsRolesRepository,
  ) {}

  async Ejecutar(id: number, dto: ActualizarSsRolesDto): Promise<SsRoles> {

    const rolExistente = await this.ssRolesRepository.ObtenerPorId(id);

    if (!rolExistente) {
      throw new NotFoundException(`No se encontró el rol con id ${id}`);
    }

    if (dto.rol) {
      const rolesConMismoNombre = await this.ssRolesRepository.ObtenerPorNombreRol(dto.rol);

      const existeConflicto = rolesConMismoNombre.some(
        r => r.rol?.toLowerCase() === dto.rol.toLowerCase() && r.id !== id
      );

      if (existeConflicto) {
        throw new ConflictException(`Ya existe un rol con el nombre ${dto.rol}`);
      }
    }

    return this.ssRolesRepository.Actualizar(id, dto);
  }

}