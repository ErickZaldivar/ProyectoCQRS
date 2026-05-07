import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { ISsTiposProgramasRepository } from '../../../../domain/interfaces/servicio_social/ss_tipos_programas.interface';
import { ActualizarSsTipoProgramaDto } from '../../../../dtos/requests/Servicio Social/Tipos_Programas/actualizar_ss_tipos_programas';
import { SsTiposProgramas } from '../../../../dtos/POCOS/servicio_social/ss_tipos_programas.poco';

@Injectable()
export class ActualizarSsTipoProgramaUseCase {

  constructor(
    @Inject('ISsTiposProgramasRepository')
    private readonly ssTiposProgramasRepository: ISsTiposProgramasRepository,
  ) {}

  async Ejecutar(id: number, dto: ActualizarSsTipoProgramaDto): Promise<SsTiposProgramas> {
    // 1. Verificar que el tipo de programa exista
    const tipoExistente = await this.ssTiposProgramasRepository.ObtenerPorId(id);

    if (!tipoExistente) {
      throw new NotFoundException(`No se encontró el tipo de programa con id ${id}`);
    }

    // 2. Si se intenta cambiar el nombre, verificar que no exista otro con el mismo nombre
    if (dto.nombre_tipo) {
      const tiposConMismoNombre = await this.ssTiposProgramasRepository.ObtenerPorNombreTipo(dto.nombre_tipo);

      const existeConflicto = tiposConMismoNombre.some(
        t => t.nombreTipo.toLowerCase() === dto.nombre_tipo.toLowerCase() && t.id !== id
      );

      if (existeConflicto) {
        throw new ConflictException(`Ya existe un tipo de programa con el nombre ${dto.nombre_tipo}`);
      }
    }

    // 3. Actualizar
    return this.ssTiposProgramasRepository.Actualizar(id, dto);
  }
}