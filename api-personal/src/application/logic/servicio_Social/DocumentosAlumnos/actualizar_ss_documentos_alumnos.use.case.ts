import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ISsDocumentosAlumnosRepository } from '../../../../domain/interfaces/servicio_social/ss_documentos_alumnos.interface';
import { ActualizarSsDocumentosAlumnosDto } from '../../../../dtos/requests/Servicio Social/DocumentosAlumnos/actualizar_ss_documentos_alumnos.dto';
import { SsDocumentosAlumnosPoco } from '../../../../dtos/POCOS/servicio_social/ss_documentos_alumnos.poco';

@Injectable()
export class ActualizarSsDocumentosAlumnosUseCase {
  constructor(
    @Inject('ISsDocumentosAlumnosRepository')
    private readonly documentosRepository: ISsDocumentosAlumnosRepository,
  ) {}

  async Ejecutar(
    id: number,
    dto: ActualizarSsDocumentosAlumnosDto,
    archivos: any,
  ): Promise<SsDocumentosAlumnosPoco> {
    const registroExistente =
      await this.documentosRepository.ObtenerEnPrincipalPorId(id);

    if (!registroExistente) {
      throw new NotFoundException(
        `No se encontró el registro de documentos con id ${id}`,
      );
    }

    return this.documentosRepository.Actualizar(id, dto, archivos);
  }
}