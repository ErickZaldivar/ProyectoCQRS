import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CrearSsRolPermisoDto {

  @ApiProperty({ example: 1, description: 'Id del rol' })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsNotEmpty()
  id_ss_rol: number;

  @ApiProperty({ example: 1, description: 'Id del permiso' })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsNotEmpty()
  id_ss_permiso: number;

}