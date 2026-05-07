import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { ISsDocumentoReplicacionPort, ReplicarDocumentoDto } from '../../domain/interfaces/servicio_social/ss_documento_replicacion.port';

@Injectable()
export class SsDocumentoReplicacionAdapter implements ISsDocumentoReplicacionPort {
  private readonly logger = new Logger(SsDocumentoReplicacionAdapter.name);
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.getOrThrow<string>('DOTNET_API_BASE_URL');
  }

  async replicar(documento: ReplicarDocumentoDto): Promise<void> {
    const url = `${this.baseUrl}/api/documentos`;

    try {
      await firstValueFrom(
        this.httpService.post(url, {
          nombreArchivo:      documento.nombreArchivo,
          contenidoBase64:    documento.contenidoBase64,
          extensionArchivo:   documento.extensionArchivo,
          tamanoArchivoBytes: documento.tamanoArchivoBytes,
          tipoDocumento:      documento.tipoDocumento,
          idEntidadOrigen:    documento.idEntidadOrigen,
          tipoEntidadOrigen:  documento.tipoEntidadOrigen,
        }),
      );

      this.logger.log(`Documento replicado correctamente: ${documento.nombreArchivo}`);
    } catch (error) {
      this.logger.error(
        `Error al replicar documento: ${documento.nombreArchivo}`,
        (error as Error).stack,
      );
      throw error;
    }
  }
}