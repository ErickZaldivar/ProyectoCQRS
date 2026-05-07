import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ActualizarSsDocumentosAlumnosDto {
  @ApiProperty({ 
    example: '1', 
    description: 'ID del alumno académico', 
    required: false 
  })
  @IsOptional()
  @IsString()
  id_alumno_academico?: string;

  @ApiProperty({ 
    example: '1', 
    description: 'ID del plan de trabajo', 
    required: false 
  })
  @IsOptional()
  @IsString()
  id_plan_trabajo?: string;
}