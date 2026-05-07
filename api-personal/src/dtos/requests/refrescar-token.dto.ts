import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefrescarTokenDto {

  @ApiProperty({ 
    example: 'eyJhbGciOiJIUzI1NiIs...', 
    description: 'Refresh token para obtener nuevos tokens de acceso' 
  })
  @IsString()
  @IsNotEmpty()
  refresh_token: string;

}