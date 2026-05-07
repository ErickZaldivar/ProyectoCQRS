import {
  Injectable,
  Inject,
  InternalServerErrorException,
  Logger,
  ConflictException,
} from '@nestjs/common';
import { ISsDocumentosAlumnosRepository } from '../../../../domain/interfaces/servicio_social/ss_documentos_alumnos.interface';
import {
  ISsDocumentoReplicacionPort,
  ReplicarDocumentoDto,
  SS_DOCUMENTO_REPLICACION_PORT,
} from '../../../../domain/interfaces/servicio_social/ss_documento_replicacion.port';
import { CrearSsDocumentosAlumnosDto } from '../../../../dtos/requests/Servicio Social/DocumentosAlumnos/crear_ss_documentos_alumnos.dto';
import { SsDocumentosAlumnosPoco } from '../../../../dtos/POCOS/servicio_social/ss_documentos_alumnos.poco';
import { ExtensionArchivo } from '../../../../domain/enums/extension_archivos.enum';
import { TipoDocumento } from '../../../../domain/enums/tipo_documento.enum';
import { TipoEntidadOrigen } from '../../../../domain/enums/tipo_entidad_origen.enum';

@Injectable()
export class CrearSsDocumentosAlumnosUseCase {
  private readonly logger = new Logger(CrearSsDocumentosAlumnosUseCase.name);

  constructor(
    @Inject('ISsDocumentosAlumnosRepository')
    private readonly documentosRepository: ISsDocumentosAlumnosRepository,

    @Inject(SS_DOCUMENTO_REPLICACION_PORT)
    private readonly replicacionPort: ISsDocumentoReplicacionPort,
  ) {}

  async Ejecutar(
    dto: CrearSsDocumentosAlumnosDto,
    archivos: any,
  ): Promise<SsDocumentosAlumnosPoco> {
    const yaExiste =
      await this.documentosRepository.ExisteEnPrincipalPorAlumno(
        Number(dto.id_alumno_academico),
      );

    if (yaExiste) {
      throw new ConflictException(
        `Ya existe un registro de documentos para el alumno ${dto.id_alumno_academico}`,
      );
    }

    const creado = await this.documentosRepository.Crear(dto, archivos);

    try {
      await this.replicarArchivos(
        archivos,
        Number(dto.id_alumno_academico),
      );
    } catch (error) {
      try {
        await this.documentosRepository.Eliminar(creado.id);
      } catch (error_) {
        this.logger.error(
          `Error al hacer rollback del documento ${creado.id}`,
          (error_ as Error).stack,
        );
      }

      throw new InternalServerErrorException(
        'Error al replicar los documentos. El guardado fue cancelado.',
      );
    }

    return creado;
  }

  private async replicarArchivos(
    archivos: any,
    idAlumno: number,
  ): Promise<void> {
    const mapaArchivos = [
      {
        campo: 'carta_presentacion',
        tipoDocumento: TipoDocumento.CartaPresentacion,
      },
      {
        campo: 'carta_compromiso',
        tipoDocumento: TipoDocumento.CartaCompromiso,
      },
      {
        campo: 'carta_aceptacion',
        tipoDocumento: TipoDocumento.CartaAceptacion,
      },
      {
        campo: 'seguro_facultativo',
        tipoDocumento: TipoDocumento.SeguroFacultativo,
      },
    ];

    for (const { campo, tipoDocumento } of mapaArchivos) {
      if (!archivos?.[campo]) continue;

      const archivo = archivos[campo][0];
      const buffer: Buffer = archivo.buffer;

      const documento: ReplicarDocumentoDto = {
        nombreArchivo: `${campo}_alumno_${idAlumno}.pdf`,
        contenidoBase64: buffer.toString('base64'),
        extensionArchivo: this.obtenerExtension(archivo.mimetype),
        tamanoArchivoBytes: buffer.length,
        tipoDocumento: tipoDocumento,
        idEntidadOrigen: idAlumno,
        tipoEntidadOrigen: TipoEntidadOrigen.Alumno,
      };

      await this.replicacionPort.replicar(documento);
    }
  }

  private obtenerExtension(mimetype: string): ExtensionArchivo {
    const mapa: Record<string, ExtensionArchivo> = {
      'application/pdf': ExtensionArchivo.Pdf,
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ExtensionArchivo.Docx,
      'application/msword': ExtensionArchivo.Doc,
    };

    const extension = mapa[mimetype];

    if (!extension) {
      throw new Error(`Tipo de archivo no soportado: ${mimetype}`);
    }

    return extension;
  }
}