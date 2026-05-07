export class LoginAlumnoResponse {

  type: string;
  id_alumno_academico: number;
  attributes: {
    nombre: string;
    matricula: string;
    creditos: number;
    carrera: string;
    semestre_activo: boolean;
  };

  access_token: string;
  refresh_token: string; 
}