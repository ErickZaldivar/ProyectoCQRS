import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { ISsPermisosRepository } from '../../../../domain/interfaces/servicio_social/ss_permisos.interface';
import { CrearSsPermisosDto } from '../../../../dtos/requests/Servicio Social/Permisos/crear_ss_permisos.dto';
import { SsPermisos } from '../../../../dtos/POCOS/servicio_social/ss_permisos.poco';

@Injectable()
export class CrearSsPermisosUseCase {
  constructor(
    @Inject('ISsPermisosRepository')
    private readonly ssPermisosRepository: ISsPermisosRepository,
  ) {}

  async Ejecutar(dto: CrearSsPermisosDto): Promise<SsPermisos> {
    const permisosExistentes = await this.ssPermisosRepository.ObtenerPorNombrePermiso(dto.permiso);
    const existe = permisosExistentes.some(p => p.permiso?.toLowerCase() === dto.permiso.toLowerCase());

    if (existe) {
      throw new ConflictException(`Ya existe el permiso ${dto.permiso}`);
    }
    return this.ssPermisosRepository.Crear(dto);
  }
}