import { IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearSsSeguimientoAlumnosDto {
  @ApiProperty({ example: 101, description: 'ID del alumno académico' })
  @IsNumber()
  @IsNotEmpty()
  id_alumno_academico: number;

  @ApiProperty({ example: 5, description: 'ID del programa' })
  @IsNumber()
  @IsNotEmpty()
  id_programa: number;

  @ApiProperty({ example: 2, description: 'ID del periodo escolar' })
  @IsNumber()
  @IsNotEmpty()
  id_periodo_escolar: number;
}