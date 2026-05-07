export class SsProgramasResponse {
  id: number;
  idOrganizacion: number;
  nombreOrganizacion: string;
  idTipoPrograma: number;
  nombreTipo: string;
  nombrePrograma: string;
  listaActividades: string;
  modalidad?: boolean;
  esModalidadInterna?: boolean;
  fechaInicioServicio?: Date;
  fechaFinServicio?: Date;
  planTrabajo?: string;
}