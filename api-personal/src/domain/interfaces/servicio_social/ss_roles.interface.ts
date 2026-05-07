import { SsRoles } from "../../../dtos/POCOS/servicio_social/ss_roles.poco";
import { CrearSsRolesDto } from "../../../dtos/requests/Servicio Social/Roles/crear_ss_roles.dto";
import { ActualizarSsRolesDto } from "../../../dtos/requests/Servicio Social/Roles/actualizar_ss_roles.dto";

export interface ISsRolesRepository {
  ObtenerTodos(): Promise<SsRoles[]>;
  ObtenerPorId(id: number): Promise<SsRoles | null>;
  ObtenerPorNombreRol(rol: string): Promise<SsRoles[]>;
  Crear(dto: CrearSsRolesDto): Promise<SsRoles>;
  Eliminar(id: number): Promise<void>;
  Actualizar(id: number, dto: ActualizarSsRolesDto): Promise<SsRoles>;
}