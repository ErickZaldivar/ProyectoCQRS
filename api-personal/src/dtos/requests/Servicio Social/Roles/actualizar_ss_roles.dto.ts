import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ActualizarSsRolesDto {

  @ApiProperty({
    example: 'Administrador',
    description: 'Nombre del rol',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  rol?: string;

}