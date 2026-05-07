export class AlumnoDatosAcademicos {
  constructor(
    public readonly id: number,
    public readonly id_alumno_personal: number,
    public readonly noControl: string,
    public readonly nip: number,
    public readonly creditosAprobados?: number
  ) {}

  ValidarNip(nipIngresado: number): boolean {
    return this.nip === nipIngresado;
  }
}