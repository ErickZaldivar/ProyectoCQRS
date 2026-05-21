import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

// Módulos
import { BdModule } from './infrastructure/modules/bd.module';
import { AuthModule } from './infrastructure/security/auth/auth.module';
import { AlumnoDatosAcademicosModule } from './infrastructure/modules/alumnos_datos_academicos.module';
import { JwtMiddleware } from './infrastructure/security/auth/jwt.middleware';
import { TokenBlacklistModule } from './infrastructure/modules/tocken-blacklist.module';

// Módulos relacionados al servicio social
import { SsOrganizacionesModule } from './infrastructure/modules/servicio_social/ss_organizaciones.module';
import { SsTiposProgramasModule } from './infrastructure/modules/servicio_social/ss_tipos_programas.module';
import { SsProgramasModule } from './infrastructure/modules/servicio_social/ss_programas.module';
import { SsRolesModule } from './infrastructure/modules/servicio_social/ss_roles.moduke';
import { SsPermisosModule } from './infrastructure/modules/servicio_social/ss_permisos.module';
import { SsSeguimientoAlumnosModule } from './infrastructure/modules/servicio_social/ss_seguimiento_alumnos.module';
import { SsRolesPermisosModule } from './infrastructure/modules/servicio_social/ss_roles_permisos.module';
import { SsDocumentosAlumnosModule } from './infrastructure/modules/servicio_social/ss_documentos_alumnos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    BdModule,
    AlumnoDatosAcademicosModule,
    TokenBlacklistModule, // ← singleton global, debe ir antes de AuthModule
    AuthModule,

    SsOrganizacionesModule,
    SsTiposProgramasModule,
    SsProgramasModule,
    SsRolesModule,
    SsPermisosModule,
    SsSeguimientoAlumnosModule,
    SsRolesPermisosModule,
    SsDocumentosAlumnosModule,
  ],

  providers: [],  // ← TokenBlacklistService ya no va aquí, vive en TokenBlacklistModule

  controllers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/refresh', method: RequestMethod.POST },
        { path: 'servicio-social/organizaciones', method: RequestMethod.GET },
      )
      .forRoutes('*');
  }
}