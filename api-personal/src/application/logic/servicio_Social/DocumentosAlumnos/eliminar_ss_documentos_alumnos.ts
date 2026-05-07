import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ISsDocumentosAlumnosRepository } from '../../../../domain/interfaces/servicio_social/ss_documentos_alumnos.interface';

@Injectable()
export class EliminarSsDocumentosAlumnosUseCase {
  constructor(
    @Inject('ISsDocumentosAlumnosRepository')
    private readonly documentosRepository: ISsDocumentosAlumnosRepository,
  ) {}

  async Ejecutar(id: number): Promise<void> {
    const documentoExistente =
      await this.documentosRepository.ObtenerEnPrincipalPorId(id);

    if (!documentoExistente) {
      throw new NotFoundException(
        `No se encontró el registro de documentos con el id ${id}`,
      );
    }

    await this.documentosRepository.Eliminar(id);
  }
}