import { IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ActualizarSsRolPermisoDto {

  @ApiProperty({ 
    example: 1, 
    description: 'Id del rol', 
    required: false 
  })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsOptional()
  id_ss_rol?: number;

  @ApiProperty({ 
    example: 1, 
    description: 'Id del permiso', 
    required: false 
  })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsOptional()
  id_ss_permiso?: number;

}