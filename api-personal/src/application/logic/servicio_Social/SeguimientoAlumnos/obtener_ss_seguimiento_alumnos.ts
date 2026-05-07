import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ISsSeguimientoAlumnosRepository } from '../../../../domain/interfaces/servicio_social/ss_seguimiento_alumnos.interface';
import { SsSeguimientoAlumnosPoco } from '../../../../dtos/POCOS/servicio_social/ss_seguimiento_alumnos.poco';


@Injectable()
export class ObtenerSsSeguimientoAlumnos {
  constructor(
    @Inject('ISsSeguimientoAlumnosRepository')
    private readonly seguimientoAlumnosRepository: ISsSeguimientoAlumnosRepository,
  ) {}

  async ObtenerTodos(): Promise<SsSeguimientoAlumnosPoco[]> {
    const seguimientos = await this.seguimientoAlumnosRepository.ObtenerTodos();
    if (!seguimientos || seguimientos.length === 0) {
      throw new NotFoundException('No se encontraron seguimientos de alumnos');
    }
    return seguimientos;
  }

  async ObtenerPorId(id: number): Promise<SsSeguimientoAlumnosPoco> {
    const seguimiento = await this.seguimientoAlumnosRepository.ObtenerPorId(id);
    if (!seguimiento) {
      throw new NotFoundException(`No se encontró el seguimiento con id ${id}`);
    }
    return seguimiento;
  }

  async ObtenerPorIdAlumnoAcademico(id_alumno: number): Promise<SsSeguimientoAlumnosPoco[]> {
    const seguimientos = await this.seguimientoAlumnosRepository.ObtenerPorIdAlumnoAcademico(id_alumno);
    if (!seguimientos || seguimientos.length === 0) {
      throw new NotFoundException(`No se encontraron seguimientos para el alumno con id ${id_alumno}`);
    }
    return seguimientos;
  }

  async ObtenerPorIdPrograma(id_programa: number): Promise<SsSeguimientoAlumnosPoco[]> {
    const seguimientos = await this.seguimientoAlumnosRepository.ObtenerPorIdPrograma(id_programa);
    if (!seguimientos || seguimientos.length === 0) {
      throw new NotFoundException(`No se encontraron seguimientos para el programa con id ${id_programa}`);
    }
    return seguimientos;
  }
}