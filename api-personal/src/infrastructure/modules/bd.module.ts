import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

let replicaAvailable = true;

export const DbStatus = {
  isReplicaAvailable: () => replicaAvailable,
  disableReplica: () => {
    replicaAvailable = false;
  },
};

@Module({
  imports: [
    ConfigModule,

    TypeOrmModule.forRootAsync({
      name: 'DB_PRINCIPAL',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: configService.get<string>('DB_PRINCIPAL_HOST'),
        port: Number(configService.get<number>('DB_PRINCIPAL_PORT')),
        username: configService.get<string>('DB_PRINCIPAL_USERNAME'),
        password: configService.get<string>('DB_PRINCIPAL_PASSWORD'),
        database: configService.get<string>('DB_PRINCIPAL_DATABASE'),
        autoLoadEntities: true,
        synchronize: false,
        logging: false,
        retryAttempts: 10,
        retryDelay: 3000,
      }),
    }),

    TypeOrmModule.forRootAsync({
      name: 'DB_REPLICA',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModuleOptions> => {
        const logger = new Logger('DB_REPLICA');

        const replicaConfig: TypeOrmModuleOptions = {
          type: 'postgres',
          host: configService.get<string>('DB_REPLICA_HOST'),
          port: Number(configService.get<number>('DB_REPLICA_PORT')),
          username: configService.get<string>('DB_REPLICA_USERNAME'),
          password: configService.get<string>('DB_REPLICA_PASSWORD'),
          database: configService.get<string>('DB_REPLICA_DATABASE'),
          autoLoadEntities: true,
          synchronize: false,
          logging: false,
          retryAttempts: 0,
        };

        try {
          const ds = new DataSource(replicaConfig as any);
          await ds.initialize();
          await ds.destroy();

          replicaAvailable = true;
          logger.log('Replica disponible');

          return replicaConfig;
        } catch {
          replicaAvailable = false;

          logger.warn(
            'Replica no disponible → GETs serán rechazados controladamente',
          );

          return {
            type: 'postgres',
            host: '127.0.0.1',
            port: 65432,
            username: 'disabled',
            password: 'disabled',
            database: 'disabled',
            autoLoadEntities: false,
            synchronize: false,
            logging: false,
            retryAttempts: 0,
          } as TypeOrmModuleOptions;
        }
      },
    }),
  ],
})
export class BdModule {}