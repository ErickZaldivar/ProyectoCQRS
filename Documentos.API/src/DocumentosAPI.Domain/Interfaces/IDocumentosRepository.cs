namespace DocumentosAPI.Domain.Interfaces;

using DocumentosAPI.Domain.Entities;

public interface IDocumentoRepository
{
    Task<Documento> ObtenerDocumentoPorIdAsync(Guid documentoId);
    Task<Documento> GuardarDocumentoAsync(Documento nuevoDocumento);
    Task<Documento> ActualizarDocumentoAsync(Documento documentoActualizado);
    Task<bool> EliminarDocumentoPorIdAsync(Guid documentoId);
}