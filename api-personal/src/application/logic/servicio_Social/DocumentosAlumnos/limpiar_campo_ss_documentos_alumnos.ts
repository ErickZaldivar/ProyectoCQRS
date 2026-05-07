import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ISsDocumentosAlumnosRepository } from '../../../../domain/interfaces/servicio_social/ss_documentos_alumnos.interface';
import { LimpiarCampoSsDocumentosAlumnosDto } from '../../../../dtos/requests/Servicio Social/DocumentosAlumnos/limpiar_campo_ss_documentos_alumnos';

@Injectable()
export class LimpiarCampoSsDocumentosAlumnosUseCase {
  constructor(
    @Inject('ISsDocumentosAlumnosRepository')
    private readonly documentosRepository: ISsDocumentosAlumnosRepository,
  ) {}

  async Ejecutar(id: number, dto: LimpiarCampoSsDocumentosAlumnosDto): Promise<void> {
    const registroExistente = await this.documentosRepository.ObtenerEnPrincipalPorId(id);

    if (!registroExistente) {
      throw new NotFoundException(
        `No se encontró el registro de documentos con id ${id}`,
      );
    }

    await this.documentosRepository.LimpiarCampo(id, dto.campo);
  }
}