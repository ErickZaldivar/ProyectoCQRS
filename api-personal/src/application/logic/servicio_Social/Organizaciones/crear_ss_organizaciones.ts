import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { ISsOrganizacionesRepository } from '../../../../domain/interfaces/servicio_social/ss_organizaciones';
import { CrearSsOrganizacionDto } from '../../../../dtos/requests/Servicio Social/Organizaciones/Crear_Organoiazciones_DTO';
import { SsOrganizaciones } from '../../../../dtos/POCOS/servicio_social/ss_organizaciones.poco';

@Injectable()
export class CrearSsOrganizacionUseCase {
  constructor(
    @Inject('ISsOrganizacionesRepository')
    private readonly ssOrganizacionesRepository: ISsOrganizacionesRepository,
  ) {}

  async Ejecutar(dto: CrearSsOrganizacionDto): Promise<SsOrganizaciones> {
    const existeOrganizacion =
      await this.ssOrganizacionesRepository.ExisteEnPrincipalPorNombre(
        dto.nombre_organizacion,
      );

    if (existeOrganizacion) {
      throw new ConflictException(
        `Ya existe una organización con el nombre ${dto.nombre_organizacion}`,
      );
    }

    return this.ssOrganizacionesRepository.Crear(dto);
  }
}