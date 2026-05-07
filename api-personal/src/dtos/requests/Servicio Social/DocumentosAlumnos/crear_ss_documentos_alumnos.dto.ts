import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearSsDocumentosAlumnosDto {
  @ApiProperty({ example: '1', description: 'ID del alumno académico' })
  @IsNotEmpty()
  @IsString()
  id_alumno_academico: string;

  @ApiProperty({ example: '1', description: 'ID del plan de trabajo' })
  @IsNotEmpty()
  @IsString()
  id_plan_trabajo: string;
}