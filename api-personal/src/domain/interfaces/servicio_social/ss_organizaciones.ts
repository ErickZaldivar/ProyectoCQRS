import { SsOrganizaciones } from "../../../dtos/POCOS/servicio_social/ss_organizaciones.poco";
import { CrearSsOrganizacionDto } from "../../../dtos/requests/Servicio Social/Organizaciones/Crear_Organoiazciones_DTO";
import { ActualizarSsOrganizacionDto } from "../../../dtos/requests/Servicio Social/Organizaciones/Actualizar_Organizaciones_DTO";

export interface ISsOrganizacionesRepository {
  ObtenerTodos(): Promise<SsOrganizaciones[]>;
  ObtenerPorId(id: number): Promise<SsOrganizaciones | null>;
  ObtenerPorNombreOrganizacion(nombre: string): Promise<SsOrganizaciones[]>;
  ObtenerPorNombreTitular(nombreTitular: string): Promise<SsOrganizaciones[]>;

  ObtenerEnPrincipalPorId(id: number): Promise<SsOrganizaciones | null>;
  ExisteEnPrincipalPorNombre(nombre: string): Promise<boolean>;
  ExisteEnPrincipalPorNombreExcluyendoId(
    nombre: string,
    id: number,
  ): Promise<boolean>;

  Crear(dto: CrearSsOrganizacionDto): Promise<SsOrganizaciones>;
  Eliminar(id: number): Promise<number>;
  EliminarPorNombre(nombre: string): Promise<number>;
  Actualizar(
    id: number,
    dto: ActualizarSsOrganizacionDto,
  ): Promise<SsOrganizaciones>;
}