import { SsPermisos } from "../../../dtos/POCOS/servicio_social/ss_permisos.poco";
import { ActualizarSsPermisosDto } from "../../../dtos/requests/Servicio Social/Permisos/actualizar_ss_permisos.dto";
import { CrearSsPermisosDto } from "../../../dtos/requests/Servicio Social/Permisos/crear_ss_permisos.dto";

export interface ISsPermisosRepository {

  ObtenerTodos(): Promise<SsPermisos[]>;

  ObtenerPorId(id: number): Promise<SsPermisos | null>;

  ObtenerPorNombrePermiso(permiso: string): Promise<SsPermisos[]>;
  
  Crear(dto: CrearSsPermisosDto): Promise<SsPermisos>;
  
  Eliminar(id: number): Promise<void>;

  Actualizar(id: number, dto: ActualizarSsPermisosDto): Promise<SsPermisos>;
}