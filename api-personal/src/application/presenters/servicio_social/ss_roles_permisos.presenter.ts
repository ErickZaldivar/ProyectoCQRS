import { SsRolesPermisos } from '../../../dtos/POCOS/servicio_social/ss_roles_permisos.poco';
import { SsRolesPermisosResponse } from '../../../dtos/responses/servicio_social/ss_roles_permisos.response';

export class SsRolesPermisosPresenter {

  static Presentar(poco: SsRolesPermisos): SsRolesPermisosResponse {
    const response = new SsRolesPermisosResponse();
    response.id = poco.id;
    response.idSsRol = poco.idSsRol;
    response.nombreRol = poco.nombreRol;
    response.idSsPermiso = poco.idSsPermiso;
    response.nombrePermiso = poco.nombrePermiso;
    return response;
  }

  static PresentarLista(pocos: SsRolesPermisos[]): SsRolesPermisosResponse[] {
    return pocos.map(poco => this.Presentar(poco));
  }
}