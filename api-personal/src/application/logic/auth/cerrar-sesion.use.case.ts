import { Injectable } from '@nestjs/common';
import { TokenBlacklistService } from '../../../infrastructure/security/auth/token-blacklist.service';

@Injectable()
export class CerrarSesionUseCase {

  constructor(
    private readonly tokenBlacklistService: TokenBlacklistService,
  ) {}

  Ejecutar(token: string): void {
    this.tokenBlacklistService.agregar(token);
  }
}