export class SsDocumentosAlumnosPoco {
  constructor(
    public readonly id: number,
    public readonly id_alumno_academico: number,
    public readonly id_plan_trabajo: number,
    public readonly carta_presentacion?: Buffer | null,
    public readonly carta_compromiso?: Buffer | null,
    public readonly carta_aceptacion?: Buffer | null,
    public readonly seguro_facultativo?: Buffer | null,
  ) {}
}