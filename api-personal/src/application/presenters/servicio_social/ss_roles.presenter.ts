import { SsRoles } from '../../../dtos/POCOS/servicio_social/ss_roles.poco';
import { SsRolesResponse } from '../../../dtos/responses/servicio_social/ss_roles.response';

export class SsRolesPresenter {

  static Presentar(poco: SsRoles): SsRolesResponse {
    const response = new SsRolesResponse();
    response.id = poco.id;
    response.rol = poco.rol;
    return response;
  }

  static PresentarLista(pocos: SsRoles[]): SsRolesResponse[] {
    return pocos.map(poco => this.Presentar(poco));
  }
}