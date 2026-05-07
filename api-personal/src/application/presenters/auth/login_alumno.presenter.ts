import { LoginAlumnoResponse } from '../../../dtos/responses/auth/login_alumno.response';

export class LoginAlumnoPresenter {
  static Presentar(
    id_alumno_academico: number,
    datosLogin: any,
    accessToken: string,
    refreshToken: string
  ): LoginAlumnoResponse {
    return {
      type: 'alumnos',
      id_alumno_academico,
      attributes: {
        nombre: datosLogin.nombreCompleto,
        matricula: datosLogin.matricula,
        creditos: datosLogin.creditos,
        carrera: datosLogin.carrera,
        semestre_activo: datosLogin.SemestreActivo,
      },
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}