import { ApiProperty } from '@nestjs/swagger';

export class SsSeguimientoAlumnosResponse {
  @ApiProperty({ example: 1, description: 'ID del seguimiento de alumno' })
  id: number;

  @ApiProperty({ example: 100, description: 'ID del alumno académico' })
  id_alumno_academico: number;

  @ApiProperty({ example: 5, description: 'ID del programa de servicio social' })
  id_programa: number;

  @ApiProperty({ example: 2, description: 'ID del periodo escolar' })
  id_periodo_escolar: number;
}