import { Injectable, Inject, ConflictException, NotFoundException } from '@nestjs/common';
import { ISsProgramasRepository } from '../../../../domain/interfaces/servicio_social/ss_programas.interface';
import { CrearSsProgramaDto } from '../../../../dtos/requests/Servicio Social/Programas/crear_ss_programas';
import { SsProgramas } from '../../../../dtos/POCOS/servicio_social/ss_programas.poco';

@Injectable()
export class CrearSsProgramaUseCase {

  constructor(
    @Inject('ISsProgramasRepository')
    private readonly ssProgramasRepository: ISsProgramasRepository,
  ) {}

  async Ejecutar(dto: CrearSsProgramaDto, planTrabajo?: Buffer): Promise<SsProgramas> {

    const programasExistentes = await this.ssProgramasRepository
      .ObtenerPorNombrePrograma(dto.nombre_programa);

    const existePrograma = programasExistentes.some(
      programa => programa.nombrePrograma.toLowerCase() === dto.nombre_programa.toLowerCase()
    );

    if (existePrograma) {
      throw new ConflictException(`Ya existe un programa con el nombre ${dto.nombre_programa}`);
    }

    const programaCreado = await this.ssProgramasRepository.Crear(dto, planTrabajo);

    if (!programaCreado) {
      throw new NotFoundException('No se pudo crear el programa');
    }

    return programaCreado;
  }

}