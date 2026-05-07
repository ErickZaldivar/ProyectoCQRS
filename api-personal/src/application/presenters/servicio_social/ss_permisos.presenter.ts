import { SsPermisos } from '../../../dtos/POCOS/servicio_social/ss_permisos.poco';
import { SsPermisosResponse } from '../../../dtos/responses/servicio_social/ss_permisos.response';

export class SsPermisosPresenter {

  static Presentar(poco: SsPermisos): SsPermisosResponse {
    const response = new SsPermisosResponse();
    response.id = poco.id;
    response.permiso = poco.permiso;
    return response;
  }

  static PresentarLista(pocos: SsPermisos[]): SsPermisosResponse[] {
    return pocos.map(poco => this.Presentar(poco));
  }
}