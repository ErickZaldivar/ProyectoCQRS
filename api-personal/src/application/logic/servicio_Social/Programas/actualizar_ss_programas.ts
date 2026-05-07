import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { ISsProgramasRepository } from '../../../../domain/interfaces/servicio_social/ss_programas.interface';
import { ActualizarSsProgramaDto } from '../../../../dtos/requests/Servicio Social/Programas/avtualizar_ss_programas';
import { SsProgramas } from '../../../../dtos/POCOS/servicio_social/ss_programas.poco';

@Injectable()
export class ActualizarSsProgramaUseCase {

  constructor(
    @Inject('ISsProgramasRepository')
    private readonly ssProgramasRepository: ISsProgramasRepository,
  ) {}

  async Ejecutar(id: number, dto: ActualizarSsProgramaDto, planTrabajo?: Buffer): Promise<SsProgramas> {
    // 1. Verificar existencia
    const programaExistente = await this.ssProgramasRepository.ObtenerPorId(id);
    if (!programaExistente) {
      throw new NotFoundException(`No se encontró el programa con id ${id}`);
    }

    // 2. Validar conflicto de nombre 
    if (dto.nombre_programa) {
      const programasConMismoNombre = await this.ssProgramasRepository.ObtenerPorNombrePrograma(dto.nombre_programa);
      const existeConflicto = programasConMismoNombre.some(
        p => p.nombrePrograma.toLowerCase() === dto.nombre_programa.toLowerCase() && p.id !== id
      );
      if (existeConflicto) {
        throw new ConflictException(`Ya existe un programa con el nombre ${dto.nombre_programa}`);
      }
    }

    // 3. Actualizar (pasa el archivo)
    return this.ssProgramasRepository.Actualizar(id, dto, planTrabajo);
  }
}