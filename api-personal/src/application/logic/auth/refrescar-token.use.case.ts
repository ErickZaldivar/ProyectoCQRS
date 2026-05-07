import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefrescarTokenResponse } from '../../../dtos/responses/auth/refresar-token.response';

@Injectable()
export class RefrescarTokenUseCase {

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async Ejecutar(refreshToken: string): Promise<RefrescarTokenResponse> {
    try {
      // Verificar el refresh token
      const payload = await this.jwtService.verifyAsync(refreshToken);

      // Preparar payload para nuevos tokens
      const newPayload = {
        sub: payload.sub,
        no_control: payload.no_control,
      };

      const accessExpiration = this.configService.get<string>('JWT_ACCESS_EXPIRATION');
      const refreshExpiration = this.configService.get<string>('JWT_REFRESH_EXPIRATION');

      if (!accessExpiration || !refreshExpiration) {
        throw new UnauthorizedException('Configuración de expiración de tokens no encontrada');
      }

      // Generar nuevo access token
      const newAccessToken = await this.jwtService.signAsync(newPayload, {
        expiresIn: accessExpiration as any,
      });

      // Generar nuevo refresh token
      const newRefreshToken = await this.jwtService.signAsync(newPayload, {
        expiresIn: refreshExpiration as any,
      });

      const response = new RefrescarTokenResponse();
      response.access_token = newAccessToken;
      response.refresh_token = newRefreshToken;

      return response;
    } catch (error) {
      // Verificar si es un error de JWT
      if (error instanceof Error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
          throw new UnauthorizedException('Refresh token inválido o expirado');
        }
      }
      
      // Si ya es un UnauthorizedException, relanzarlo
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      // Cualquier otro error
      throw new UnauthorizedException('Error al refrescar el token');
    }
  }
}