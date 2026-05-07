import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearSsRolesDto {
  @ApiProperty({
    example: 'Administrador',
    description: 'Nombre del rol',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  rol: string;
}