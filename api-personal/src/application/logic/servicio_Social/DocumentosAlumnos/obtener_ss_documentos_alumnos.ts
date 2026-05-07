import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ISsDocumentosAlumnosRepository } from '../../../../domain/interfaces/servicio_social/ss_documentos_alumnos.interface';
import { SsDocumentosAlumnosPoco } from '../../../../dtos/POCOS/servicio_social/ss_documentos_alumnos.poco';

@Injectable()
export class ObtenerSsDocumentosAlumnos {
  constructor(
    @Inject('ISsDocumentosAlumnosRepository')
    private readonly documentosRepository: ISsDocumentosAlumnosRepository,
  ) {}

  async ObtenerTodos(): Promise<SsDocumentosAlumnosPoco[]> {
    const docs = await this.documentosRepository.ObtenerTodos();
    if (!docs || docs.length === 0) throw new NotFoundException('No hay documentos');
    return docs;
  }

  async ObtenerPorId(id: number): Promise<SsDocumentosAlumnosPoco> {
    const doc = await this.documentosRepository.ObtenerPorId(id);
    if (!doc) throw new NotFoundException('Documento no encontrado');
    return doc;
  }

  async ObtenerPorIdAlumnoAcademico(id_alumno: number): Promise<SsDocumentosAlumnosPoco[]> {
    const docs = await this.documentosRepository.ObtenerPorIdAlumnoAcademico(id_alumno);
    if (!docs || docs.length === 0) throw new NotFoundException('No hay documentos para este alumno');
    return docs;
  }

  async ObtenerPorIdPlanTrabajo(id_plan_trabajo: number): Promise<SsDocumentosAlumnosPoco[]> {
    const documentos = await this.documentosRepository.ObtenerPorIdPlanTrabajo(id_plan_trabajo);
    if (!documentos || documentos.length === 0) {
      throw new NotFoundException(`No se encontraron documentos para el plan de trabajo con id ${id_plan_trabajo}`);
    }
    return documentos;
  }
}