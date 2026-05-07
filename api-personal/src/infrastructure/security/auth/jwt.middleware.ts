import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { TokenBlacklistService } from './token-blacklist.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {

  constructor(
    private readonly jwtService: JwtService,
    private readonly tokenBlacklistService: TokenBlacklistService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        throw new UnauthorizedException('Token no proporcionado');
      }

      const token = authHeader.split(' ')[1];

      if (!token) {
        throw new UnauthorizedException('Formato de token inválido');
      }

      // ← Nueva verificación
      if (this.tokenBlacklistService.estaRevocado(token)) {
        throw new UnauthorizedException('Token revocado');
      }

      const payload = await this.jwtService.verifyAsync(token);
      req['user'] = payload;

      next();
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}