import { SsDocumentosAlumnosPoco } from '../../../dtos/POCOS/servicio_social/ss_documentos_alumnos.poco';
import { SsDocumentosAlumnosResponse } from '../../../dtos/responses/servicio_social/ss_documentos_alumnos.response';

export class SsDocumentosAlumnosPresenter {

  static bufferToBase64(buffer: Buffer | null | undefined): string | null {
    if (!buffer) return null;
    return buffer.toString('base64');
  }

  static Presentar(poco: SsDocumentosAlumnosPoco): SsDocumentosAlumnosResponse {
    const response = new SsDocumentosAlumnosResponse();
    response.id = poco.id;
    response.id_alumno_academico = poco.id_alumno_academico;
    response.id_plan_trabajo = poco.id_plan_trabajo;
    response.carta_presentacion = this.bufferToBase64(poco.carta_presentacion);
    response.carta_compromiso = this.bufferToBase64(poco.carta_compromiso);
    response.carta_aceptacion = this.bufferToBase64(poco.carta_aceptacion);
    response.seguro_facultativo = this.bufferToBase64(poco.seguro_facultativo);
    return response;
  }

  static PresentarLista(pocos: SsDocumentosAlumnosPoco[]): SsDocumentosAlumnosResponse[] {
    return pocos.map(poco => this.Presentar(poco));
  }
}