import { IsString, IsOptional, IsBoolean, IsInt, IsDateString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ActualizarSsProgramaDto {

  @ApiProperty({ example: 1, description: 'Id de la organización', required: false })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsOptional()
  id_organizacion?: number;

  @ApiProperty({ example: 1, description: 'Id del tipo de programa', required: false })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsOptional()
  id_tipo_programa?: number;

  @ApiProperty({ example: 'Programa de Apoyo Comunitario', description: 'Nombre del programa', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  nombre_programa?: string;

  @ApiProperty({ example: true, description: 'Modalidad del programa (true = interno, false = externo)', required: false })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @IsOptional()
  modalidad?: boolean;

  @ApiProperty({ example: '2024-01-01', description: 'Fecha de inicio del servicio', required: false })
  @IsDateString()
  @IsOptional()
  fecha_inicio_servicio?: string;

  @ApiProperty({ example: '2024-06-30', description: 'Fecha de fin del servicio', required: false })
  @IsDateString()
  @IsOptional()
  fecha_fin_servicio?: string;

  @ApiProperty({ example: 'Actividad 1, Actividad 2', description: 'Lista de actividades del programa', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(300)
  lista_actividades?: string;
}