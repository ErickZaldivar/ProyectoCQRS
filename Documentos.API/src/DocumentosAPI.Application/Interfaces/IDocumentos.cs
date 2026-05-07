namespace DocumentosAPI.Application.Interfaces;

using DocumentosAPI.Domain.DTOS.Request;
using DocumentosAPI.Domain.DTOS.Responses;

public interface IDocumentos
{
    Task<DocumentoResponse> SubirDocumentoAsync(DocumentoRequest documentoRequest);
    Task<DocumentoArchivoResponse> DescargarDocumentoAsync(Guid documentoId);
    Task<DocumentoResponse> ReemplazarArchivoDocumentoAsync(Guid documentoId, DocumentoActualizarRequest documentoActualizarRequest);
    Task<bool> EliminarDocumentoAsync(Guid documentoId);
}