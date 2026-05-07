import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ActualizarSsTipoProgramaDto {

  @ApiProperty({
    example: 'Servicio Social Comunitario',
    description: 'Nombre del tipo de programa',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  nombre_tipo?: string;

}