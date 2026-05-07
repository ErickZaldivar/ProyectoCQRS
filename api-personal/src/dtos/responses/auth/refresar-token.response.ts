import { ApiProperty } from '@nestjs/swagger';

export class RefrescarTokenResponse {

  @ApiProperty({ 
    example: 'eyJhbGciOiJIUzI1NiIs...', 
    description: 'Nuevo access token' 
  })
  access_token: string;

  @ApiProperty({ 
    example: 'eyJhbGciOiJIUzI1NiIs...', 
    description: 'Nuevo refresh token' 
  })
  refresh_token: string;

}