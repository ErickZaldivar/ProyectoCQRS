import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { ISsRolesRepository } from '../../../../domain/interfaces/servicio_social/ss_roles.interface';
import { CrearSsRolesDto } from '../../../../dtos/requests/Servicio Social/Roles/crear_ss_roles.dto';
import { SsRoles } from '../../../../dtos/POCOS/servicio_social/ss_roles.poco';

@Injectable()
export class CrearSsRolesUseCase {
  constructor(
    @Inject('ISsRolesRepository')
    private readonly ssRolesRepository: ISsRolesRepository,
  ) {}

  async Ejecutar(dto: CrearSsRolesDto): Promise<SsRoles> {
    const rolesExistentes = await this.ssRolesRepository.ObtenerPorNombreRol(dto.rol);

    // Validación para no duplicar roles
    const existeRol = rolesExistentes.some(
      r => r.rol?.toLowerCase() === dto.rol.toLowerCase()
    );

    if (existeRol) {
      throw new ConflictException(`Ya existe el rol con el nombre ${dto.rol}`);
    }

    return this.ssRolesRepository.Crear(dto);
  }
}