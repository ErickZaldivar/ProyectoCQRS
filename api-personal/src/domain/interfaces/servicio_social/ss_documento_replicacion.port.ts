import { ExtensionArchivo } from '../../enums/extension_archivos.enum';
import { TipoDocumento } from '../../enums/tipo_documento.enum';
import { TipoEntidadOrigen } from '../../enums/tipo_entidad_origen.enum';

export interface ReplicarDocumentoDto {
  nombreArchivo:      string;
  contenidoBase64:    string;
  extensionArchivo:   ExtensionArchivo;
  tamanoArchivoBytes: number;
  tipoDocumento:      TipoDocumento;
  idEntidadOrigen:    number;
  tipoEntidadOrigen:  TipoEntidadOrigen;
}

export const SS_DOCUMENTO_REPLICACION_PORT = 'ISsDocumentoReplicacionPort';

export interface ISsDocumentoReplicacionPort {
  replicar(documento: ReplicarDocumentoDto): Promise<void>;
}