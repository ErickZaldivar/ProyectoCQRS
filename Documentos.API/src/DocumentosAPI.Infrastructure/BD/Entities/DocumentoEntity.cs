namespace DocumentosAPI.Infrastructure.BD.Entities;

public class DocumentoEntity
{
    public Guid Id { get; set; }
    public string NombreArchivo { get; set; } = string.Empty;
    public string ContenidoBase64 { get; set; } = string.Empty;
    public string ExtensionArchivo { get; set; } = string.Empty;
    public long TamanoArchivoBytes { get; set; }
    public short IdTipoDocumento { get; set; }
    public short IdEstadoDocumento { get; set; }
    public long? IdEntidadOrigen { get; set; }
    public string? TipoEntidadOrigen { get; set; }
    public DateTime FechaCreacionDocumento { get; set; }
    public DateTime? FechaActualizacionDocumento { get; set; }
    public DateTime? FechaEliminacionDocumento { get; set; }

    public CatTipoDocumentoEntity CatTipoDocumento { get; set; } = null!;
    public CatEstadoDocumentoEntity CatEstadoDocumento { get; set; } = null!;
}