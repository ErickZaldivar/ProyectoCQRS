export class SsProgramas {
  constructor(
    public readonly id: number,
    public readonly idOrganizacion: number,
    public readonly nombreOrganizacion: string,
    public readonly idTipoPrograma: number,
    public readonly nombreTipo: string,
    public readonly nombrePrograma: string,
    public readonly listaActividades: string,
    public readonly modalidad?: boolean,
    public readonly fechaInicioServicio?: Date,
    public readonly fechaFinServicio?: Date,
    public readonly planTrabajo?: Buffer,
  ) {}

  get EsModalidadInterna(): boolean {
    return this.modalidad === true;
  }

}