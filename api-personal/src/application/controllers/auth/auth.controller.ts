import { Body, Controller, Post, HttpCode, HttpStatus, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { IniciarSesionUseCase } from '../../logic/auth/iniciar-sesion.use-case';
import { RefrescarTokenUseCase } from '../../logic/auth/refrescar-token.use.case';
import { CerrarSesionUseCase } from '../../logic/auth/cerrar-sesion.use.case';
import { IniciarSesionDto } from '../../../dtos/requests/iniciar-sesion.dto';
import { RefrescarTokenDto } from '../../../dtos/requests/refrescar-token.dto';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {

  constructor(
    private readonly iniciarSesionUseCase: IniciarSesionUseCase,
    private readonly refrescarTokenUseCase: RefrescarTokenUseCase,
    private readonly cerrarSesionUseCase: CerrarSesionUseCase,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión', description: 'Autentica al alumno con número de control y NIP' })
  @ApiBody({ type: IniciarSesionDto })
  @ApiResponse({ status: 200, description: 'Login exitoso, retorna datos del alumno' })
  @ApiResponse({ status: 401, description: 'Credenciales incorrectas' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  async signIn(@Body() dto: IniciarSesionDto) {
    return this.iniciarSesionUseCase.Ejecutar(dto.no_control, dto.nip);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @ApiOperation({ summary: 'Refrescar tokens', description: 'Genera un nuevo access token usando un refresh token válido' })
  @ApiBody({ type: RefrescarTokenDto })
  @ApiResponse({ status: 200, description: 'Tokens renovados correctamente' })
  @ApiResponse({ status: 401, description: 'Refresh token inválido o expirado' })
  async refresh(@Body() dto: RefrescarTokenDto) {
    return this.refrescarTokenUseCase.Ejecutar(dto.refresh_token);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @ApiOperation({ summary: 'Cerrar sesión', description: 'Revoca el access token actual' })
  @ApiResponse({ status: 200, description: 'Sesión cerrada correctamente' })
  @ApiResponse({ status: 401, description: 'Token no proporcionado o inválido' })
  async logout(@Headers('authorization') authHeader: string) {
    const token = authHeader?.split(' ')[1];
    this.cerrarSesionUseCase.Ejecutar(token);
    return { message: 'Sesión cerrada correctamente' };
  }
}