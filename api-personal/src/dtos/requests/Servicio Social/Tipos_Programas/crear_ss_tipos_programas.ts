import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearSsTipoProgramaDto {

  @ApiProperty({
    example: 'Servicio Social Comunitario',
    description: 'Nombre del tipo de programa',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre_tipo: string;

}