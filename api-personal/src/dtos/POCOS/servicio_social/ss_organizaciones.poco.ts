export class SsOrganizaciones {
  constructor(
    public readonly id: number,
    public readonly nombreOrganizacion: string,
    public readonly nombreTitularOrganizacion?: string,
    public readonly puestoTitularOrganizaciones?: string,
  ) {}
}