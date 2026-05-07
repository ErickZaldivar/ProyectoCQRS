export class DatosLoginAlumno {
  constructor(
    public readonly nombreCompleto: string,
    public readonly matricula: string,
    public readonly creditos: number,
    public readonly carrera: string,
    public readonly semestre: number,
  ) {}

  get SemestreActivo(): boolean {
    return this.semestre <= 12;
  }
}