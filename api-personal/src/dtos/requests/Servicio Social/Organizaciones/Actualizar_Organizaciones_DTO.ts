import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ActualizarSsOrganizacionDto {

  @ApiProperty({
    example: 'Tech SA de CV',
    description: 'Nombre de la organización',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  nombre_organizacion?: string;

  @ApiProperty({
    example: 'JUAN JOSE HERNANDEZ PEREZ',
    description: 'Nombre del titular de la organización',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  nombre_titular_organizacion?: string;

  @ApiProperty({
    example: 'Director General',
    description: 'Puesto del titular de la organización',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  puesto_titular_organizaciones?: string;

}