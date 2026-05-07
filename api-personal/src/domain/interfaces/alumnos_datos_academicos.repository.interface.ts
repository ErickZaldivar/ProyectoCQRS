import { AlumnoDatosAcademicos } from "../../dtos/POCOS/alumnos_datos_academicos.entity";
import { DatosLoginAlumno } from '../../dtos/POCOS/datos_logfn_alumno.poco';

export interface IAlumnoDatosAcademicosRepository {

  BuscarPorNoControl(noControl: string): Promise<AlumnoDatosAcademicos | null>;

  ObtenerDatosLoginPorNoControl(noControl: string): Promise<DatosLoginAlumno | null>;

}