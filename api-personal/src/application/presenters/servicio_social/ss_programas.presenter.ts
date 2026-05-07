import { SsProgramas } from '../../../dtos/POCOS/servicio_social/ss_programas.poco';
import { SsProgramasResponse } from '../../../dtos/responses/servicio_social/ss_programas.respinse';

export class SsProgramasPresenter {

  static Presentar(poco: SsProgramas): SsProgramasResponse {
    const response = new SsProgramasResponse();
    response.id = poco.id;
    response.idOrganizacion = poco.idOrganizacion;
    response.nombreOrganizacion = poco.nombreOrganizacion;
    response.idTipoPrograma = poco.idTipoPrograma;
    response.nombreTipo = poco.nombreTipo;
    response.nombrePrograma = poco.nombrePrograma;
    response.listaActividades = poco.listaActividades;
    response.modalidad = poco.modalidad;
    response.esModalidadInterna = poco.EsModalidadInterna;
    response.fechaInicioServicio = poco.fechaInicioServicio;
    response.fechaFinServicio = poco.fechaFinServicio;
    response.planTrabajo = poco.planTrabajo
      ? Buffer.from(poco.planTrabajo).toString('base64')
      : null;

    return response;
  }

  static PresentarLista(pocos: SsProgramas[]): SsProgramasResponse[] {
    return pocos.map(poco => this.Presentar(poco));
  }

}