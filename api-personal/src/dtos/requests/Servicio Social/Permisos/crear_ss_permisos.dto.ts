import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearSsPermisosDto {
  @ApiProperty({ example: 'VER_USUARIOS', description: 'Nombre del permiso' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  permiso: string;
}