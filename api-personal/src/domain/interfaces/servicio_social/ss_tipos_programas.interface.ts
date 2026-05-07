import { SsTiposProgramas } from "../../../dtos/POCOS/servicio_social/ss_tipos_programas.poco";
import { CrearSsTipoProgramaDto } from "../../../dtos/requests/Servicio Social/Tipos_Programas/crear_ss_tipos_programas";
import { ActualizarSsTipoProgramaDto } from "../../../dtos/requests/Servicio Social/Tipos_Programas/actualizar_ss_tipos_programas";

export interface ISsTiposProgramasRepository {
  ObtenerTodos(): Promise<SsTiposProgramas[]>;
  ObtenerPorId(id: number): Promise<SsTiposProgramas | null>;
  ObtenerPorNombreTipo(nombreTipo: string): Promise<SsTiposProgramas[]>;
  Crear(dto: CrearSsTipoProgramaDto): Promise<SsTiposProgramas>;
  Eliminar(id: number): Promise<void>;
  EliminarPorNombre(nombreTipo: string): Promise<void>;
  Actualizar(id: number, dto: ActualizarSsTipoProgramaDto): Promise<SsTiposProgramas>;
}