import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

/**
 * Este guard verifica que el usuario haya sido autenticado previamente
 * por el JwtMiddleware.
 * Este guard solo verifica que request.user exista.
 */
@Injectable()
export class JwtGuard implements CanActivate {

  canActivate(context: ExecutionContext): boolean {

    const request = context.switchToHttp().getRequest();

    const user = request.user;

    /*
    Si no existe user, significa que:
    - el middleware no encontró token
    - el token era inválido
    - el middleware no se ejecutó
    */

    if (!user) {
      throw new UnauthorizedException(
        'Acceso no autorizado. Usuario no autenticado.',
      );
    }

    // Si existe el usuario, permitir acceso
    return true;
  }

}
