import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IniciarSesionDto {

  @ApiProperty({ 
    example: '00040125', 
    description: 'Número de control del alumno' 
  })
  @IsString()
  @IsNotEmpty()
  @Length(4, 20)
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'El número de control solo puede contener letras y números'
  })
  no_control: string;

  @ApiProperty({ 
    example: '1234', 
    description: 'NIP del alumno' 
  })
  @IsString()
  @IsNotEmpty()
  @Length(4, 10)
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'El NIP solo puede contener letras y números'
  })
  nip: string;

}