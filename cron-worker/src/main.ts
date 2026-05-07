import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentosService } from './documentos/documentos.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('CronWorker');

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'], // ✅ Solo muestra errores críticos del sistema
  });

  try {
    const service = app.get(DocumentosService);
    await service.verificarDocumentosPendientes();
  } catch (error) {
    logger.error('Error durante la verificación:', error);
    process.exit(1);
  } finally {
    await app.close();
    process.exit(0);
  }
}

bootstrap();