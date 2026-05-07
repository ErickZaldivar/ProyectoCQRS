import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IAlumnoDatosAcademicosRepository } from '../../../domain/interfaces/alumnos_datos_academicos.repository.interface';
import { LoginAlumnoResponse } from '../../../dtos/responses/auth/login_alumno.response';
import { LoginAlumnoPresenter } from '../../presenters/auth/login_alumno.presenter';

@Injectable()
export class IniciarSesionUseCase {

  constructor(
    @Inject('IAlumnoDatosAcademicosRepository')
    private readonly alumnoRepository: IAlumnoDatosAcademicosRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async Ejecutar(noControl: string, nip: string): Promise<LoginAlumnoResponse> {
    const alumno = await this.alumnoRepository.BuscarPorNoControl(noControl);

    if (!alumno) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    if (!alumno.ValidarNip(Number(nip))) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const datosLogin = await this.alumnoRepository.ObtenerDatosLoginPorNoControl(noControl);

    if (!datosLogin) {
      throw new UnauthorizedException('No se pudieron obtener los datos del alumno');
    }

    const payload = {
      sub: alumno.id,
      no_control: alumno.noControl,
    };

    // Access token
    const accessToken = await this.jwtService.signAsync(payload);

    const refreshExpiration = this.configService.get<string>('JWT_REFRESH_EXPIRATION');

    if (!refreshExpiration) {
      throw new UnauthorizedException('Configuración de refresh token no encontrada');
    }

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: refreshExpiration as any,
    });

    return LoginAlumnoPresenter.Presentar(
      alumno.id,
      datosLogin,
      accessToken,
      refreshToken
    );
  }
}