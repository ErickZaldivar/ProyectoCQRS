import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ActualizarSsPermisosDto {
  @ApiProperty({
    example: 'crear_usuarios',
    description: 'Nombre único del permiso',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  permiso?: string;

  @ApiProperty({
    example: 'Permite al usuario crear nuevas cuentas',
    description: 'Breve descripción de lo que hace el permiso',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  descripcion?: string;
}