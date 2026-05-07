namespace DocumentosAPI.Infrastructure.BD.Repositories;

using DocumentosAPI.Domain.Entities;
using DocumentosAPI.Domain.Enums;
using DocumentosAPI.Domain.Interfaces;
using DocumentosAPI.Infrastructure.BD.Context;
using DocumentosAPI.Infrastructure.BD.Entities;
using Microsoft.EntityFrameworkCore;

public class DocumentoRepository : IDocumentoRepository
{
    private readonly AppDbContext _appDbContext;

    public DocumentoRepository(AppDbContext appDbContext)
    {
        _appDbContext = appDbContext;
    }

    public async Task<Documento> ObtenerDocumentoPorIdAsync(Guid documentoId)
    {
        DocumentoEntity? documentoEncontrado = await _appDbContext.Documentos
            .FirstOrDefaultAsync(documento => documento.Id == documentoId);

        if (documentoEncontrado is null)
            return null!;

        return MapearADocumentoDomain(documentoEncontrado);
    }

    public async Task<Documento> GuardarDocumentoAsync(Documento nuevoDocumento)
    {
        DocumentoEntity nuevaDocumentoEntity = new DocumentoEntity
        {
            Id                          = nuevoDocumento.Id,
            NombreArchivo               = nuevoDocumento.NombreArchivo,
            ContenidoBase64             = nuevoDocumento.ContenidoBase64,
            ExtensionArchivo            = nuevoDocumento.ExtensionArchivo.ToString(),
            TamanoArchivoBytes          = nuevoDocumento.TamanoArchivoBytes,
            IdTipoDocumento             = (short)nuevoDocumento.TipoDocumento,
            IdEstadoDocumento           = (short)nuevoDocumento.EstadoDocumento,
            IdEntidadOrigen             = nuevoDocumento.IdEntidadOrigen,
            TipoEntidadOrigen           = nuevoDocumento.TipoEntidadOrigen?.ToString(),
            FechaCreacionDocumento      = nuevoDocumento.FechaCreacionDocumento,
            FechaActualizacionDocumento = null,
            FechaEliminacionDocumento   = null
        };

        await _appDbContext.Documentos.AddAsync(nuevaDocumentoEntity);
        await _appDbContext.SaveChangesAsync();

        return MapearADocumentoDomain(nuevaDocumentoEntity);
    }

    public async Task<Documento> ActualizarDocumentoAsync(Documento documentoActualizado)
    {
        DocumentoEntity? documentoEntityExistente = await _appDbContext.Documentos
            .FirstOrDefaultAsync(documento => documento.Id == documentoActualizado.Id);

        documentoEntityExistente!.ContenidoBase64             = documentoActualizado.ContenidoBase64;
        documentoEntityExistente.ExtensionArchivo             = documentoActualizado.ExtensionArchivo.ToString();
        documentoEntityExistente.TamanoArchivoBytes           = documentoActualizado.TamanoArchivoBytes;
        documentoEntityExistente.FechaActualizacionDocumento  = documentoActualizado.FechaActualizacionDocumento;

        _appDbContext.Documentos.Update(documentoEntityExistente);
        await _appDbContext.SaveChangesAsync();

        return MapearADocumentoDomain(documentoEntityExistente);
    }

    public async Task<bool> EliminarDocumentoPorIdAsync(Guid documentoId)
    {
        DocumentoEntity? documentoEntityExistente = await _appDbContext.Documentos
            .FirstOrDefaultAsync(documento => documento.Id == documentoId);

        documentoEntityExistente!.IdEstadoDocumento         = (short)EstadoDocumento.Eliminado;
        documentoEntityExistente.FechaEliminacionDocumento  = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Utc);

        _appDbContext.Documentos.Update(documentoEntityExistente);
        await _appDbContext.SaveChangesAsync();

        return true;
    }

    private static Documento MapearADocumentoDomain(DocumentoEntity documentoEntity)
    {
        TipoEntidadOrigen? tipoEntidadOrigen = documentoEntity.TipoEntidadOrigen is not null
            ? Enum.Parse<TipoEntidadOrigen>(documentoEntity.TipoEntidadOrigen)
            : null;

        ExtensionArchivo extensionArchivo = documentoEntity.ExtensionArchivo is not null
            ? Enum.Parse<ExtensionArchivo>(documentoEntity.ExtensionArchivo)
            : ExtensionArchivo.Pdf;

        return Documento.ReconstruirDocumento(new DocumentoReconstruccionParams
        {
            Id                          = documentoEntity.Id,
            NombreArchivo               = documentoEntity.NombreArchivo ?? string.Empty,
            ContenidoBase64             = documentoEntity.ContenidoBase64 ?? string.Empty,
            ExtensionArchivo            = extensionArchivo,
            TamanoArchivoBytes          = documentoEntity.TamanoArchivoBytes,
            TipoDocumento               = (TipoDocumento)documentoEntity.IdTipoDocumento,
            EstadoDocumento             = (EstadoDocumento)documentoEntity.IdEstadoDocumento,
            IdEntidadOrigen             = documentoEntity.IdEntidadOrigen,
            TipoEntidadOrigen           = tipoEntidadOrigen,
            FechaCreacionDocumento      = documentoEntity.FechaCreacionDocumento,
            FechaActualizacionDocumento = documentoEntity.FechaActualizacionDocumento,
            FechaEliminacionDocumento   = documentoEntity.FechaEliminacionDocumento
        });
    }
}