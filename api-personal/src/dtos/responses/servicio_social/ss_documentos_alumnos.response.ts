export class SsDocumentosAlumnosResponse {
  id: number;
  id_alumno_academico: number;
  id_plan_trabajo: number;
  carta_presentacion?: string | null;   // base64
  carta_compromiso?: string | null;     // base64
  carta_aceptacion?: string | null;     // base64
  seguro_facultativo?: string | null;   // base64
}