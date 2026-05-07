import { SsSeguimientoAlumnosPoco } from '../../../dtos/POCOS/servicio_social/ss_seguimiento_alumnos.poco';
import { CrearSsSeguimientoAlumnosDto } from '../../../dtos/requests/Servicio Social/SeguimientoAlumnos/crear_ss_seguimiento_alumnos.dto';

export interface ISsSeguimientoAlumnosRepository {
  ObtenerTodos(): Promise<SsSeguimientoAlumnosPoco[]>;
  ObtenerPorId(id: number): Promise<SsSeguimientoAlumnosPoco | null>;
  ObtenerPorIdAlumnoAcademico(id_alumno_academico: number): Promise<SsSeguimientoAlumnosPoco[]>;
  ObtenerPorIdPrograma(id_programa: number): Promise<SsSeguimientoAlumnosPoco[]>;
  Crear(dto: CrearSsSeguimientoAlumnosDto): Promise<SsSeguimientoAlumnosPoco>;
  Eliminar(id: number): Promise<void>;
}