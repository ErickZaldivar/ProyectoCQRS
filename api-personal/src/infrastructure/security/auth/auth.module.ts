import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from '../../../application/controllers/auth/auth.controller';
import { IniciarSesionUseCase } from '../../../application/logic/auth/iniciar-sesion.use-case';
import { RefrescarTokenUseCase } from '../../../application/logic/auth/refrescar-token.use.case';
import { CerrarSesionUseCase } from '../../../application/logic/auth/cerrar-sesion.use.case';
import { AlumnoDatosAcademicosModule } from '../../modules/alumnos_datos_academicos.module';
import { TokenBlacklistModule } from '../../modules/tocken-blacklist.module';

@Module({
  imports: [
    AlumnoDatosAcademicosModule,
    TokenBlacklistModule, // ← permite que CerrarSesionUseCase inyecte TokenBlacklistService

    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const expiresIn = configService.get<string>('JWT_ACCESS_EXPIRATION');

        if (!expiresIn) {
          throw new Error('JWT_ACCESS_EXPIRATION no está definida en las variables de entorno');
        }

        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: expiresIn as any,
          },
        };
      },
    }),
  ],

  providers: [
    IniciarSesionUseCase,
    RefrescarTokenUseCase,
    CerrarSesionUseCase,
  ],

  controllers: [
    AuthController,
  ],

  exports: [
    IniciarSesionUseCase,
    RefrescarTokenUseCase,
    JwtModule,
  ],
})
export class AuthModule {}