import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DocumentosService } from './documentos.service';

@Injectable()
export class CronService {
  constructor(private readonly documentosService: DocumentosService) {}

  @Cron('*/2 * * * *') // Cada 2 minutos
  async handleCron() {
    await this.documentosService.verificarDocumentosPendientes();
  }
}