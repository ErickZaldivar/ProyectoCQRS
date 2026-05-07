import { SsSeguimientoAlumnosPoco } from '../../../dtos/POCOS/servicio_social/ss_seguimiento_alumnos.poco';
import { SsSeguimientoAlumnosResponse } from '../../../dtos/responses/servicio_social/ss_seguimiento_alumnos.response';

export class SsSeguimientoAlumnosPresenter {

  static Presentar(poco: SsSeguimientoAlumnosPoco): SsSeguimientoAlumnosResponse {
    const response = new SsSeguimientoAlumnosResponse();
    response.id = poco.id;
    response.id_alumno_academico = poco.id_alumno_academico;
    response.id_programa = poco.id_programa;
    response.id_periodo_escolar = poco.id_periodo_escolar;
    return response;
  }

  static PresentarLista(pocos: SsSeguimientoAlumnosPoco[]): SsSeguimientoAlumnosResponse[] {
    return pocos.map(poco => this.Presentar(poco));
  }
}