import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenBlacklistService {
  private readonly blacklist = new Set<string>();

  agregar(token: string): void {
    this.blacklist.add(token);
  }

  estaRevocado(token: string): boolean {
    return this.blacklist.has(token);
  }
}