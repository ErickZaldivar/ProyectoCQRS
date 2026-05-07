import { SsRolesPermisos } from "../../../dtos/POCOS/servicio_social/ss_roles_permisos.poco";
import { CrearSsRolPermisoDto } from "../../../dtos/requests/Servicio Social/Roles_Permisos/crear_ss_roles_permisos.dto";
import { ActualizarSsRolPermisoDto } from "../../../dtos/requests/Servicio Social/Roles_Permisos/actualizar_ss_roles_permisos.dto";

export interface ISsRolesPermisosRepository {
  ObtenerTodos(): Promise<SsRolesPermisos[]>;
  ObtenerPorId(id: number): Promise<SsRolesPermisos | null>;
  ObtenerPorRol(idRol: number): Promise<SsRolesPermisos[]>;
  ObtenerPorPermiso(idPermiso: number): Promise<SsRolesPermisos[]>;
  Crear(dto: CrearSsRolPermisoDto): Promise<SsRolesPermisos>;
  Eliminar(id: number): Promise<void>;
  Actualizar(id: number, dto: ActualizarSsRolPermisoDto): Promise<SsRolesPermisos>;
}