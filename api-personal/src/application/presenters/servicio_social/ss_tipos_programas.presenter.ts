import { SsTiposProgramas } from '../../../dtos/POCOS/servicio_social/ss_tipos_programas.poco';
import { SsTiposProgramasResponse } from '../../../dtos/responses/servicio_social/ss_tipos_programas.response';

export class SsTiposProgramasPresenter {

  static Presentar(poco: SsTiposProgramas): SsTiposProgramasResponse {
    const response = new SsTiposProgramasResponse();
    response.id = poco.id;
    response.nombreTipo = poco.nombreTipo;
    return response;
  }

  static PresentarLista(pocos: SsTiposProgramas[]): SsTiposProgramasResponse[] {
    return pocos.map(poco => this.Presentar(poco));
  }
}