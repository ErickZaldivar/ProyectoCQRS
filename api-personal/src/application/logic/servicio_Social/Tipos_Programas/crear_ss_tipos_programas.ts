import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { ISsTiposProgramasRepository } from '../../../../domain/interfaces/servicio_social/ss_tipos_programas.interface';
import { CrearSsTipoProgramaDto } from '../../../../dtos/requests/Servicio Social/Tipos_Programas/crear_ss_tipos_programas';
import { SsTiposProgramas } from '../../../../dtos/POCOS/servicio_social/ss_tipos_programas.poco';

@Injectable()
export class CrearSsTipoProgramaUseCase {

  constructor(
    @Inject('ISsTiposProgramasRepository')
    private readonly ssTiposProgramasRepository: ISsTiposProgramasRepository,
  ) {}

  async Ejecutar(dto: CrearSsTipoProgramaDto): Promise<SsTiposProgramas> {

    const tiposExistentes = await this.ssTiposProgramasRepository
      .ObtenerPorNombreTipo(dto.nombre_tipo);

    const existeTipo = tiposExistentes.some(
      tipo => tipo.nombreTipo.toLowerCase() === dto.nombre_tipo.toLowerCase()
    );

    if (existeTipo) {
      throw new ConflictException(`Ya existe un tipo de programa con el nombre ${dto.nombre_tipo}`);
    }

    return this.ssTiposProgramasRepository.Crear(dto);
  }

}