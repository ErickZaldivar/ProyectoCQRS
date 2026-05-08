import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.createApplicationContext(AppModule, {
      logger: console,
    });
  } catch (error) {
    console.error('Error completo:', error);
    process.exit(1);
  }
}

bootstrap();