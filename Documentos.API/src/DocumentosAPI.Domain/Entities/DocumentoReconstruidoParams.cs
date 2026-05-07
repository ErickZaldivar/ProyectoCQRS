namespace DocumentosAPI.Domain.Entities;

using DocumentosAPI.Domain.Enums;

public class DocumentoReconstruccionParams
{
    public Guid Id { get; set; }
    public string NombreArchivo { get; set; } = string.Empty;
    public string ContenidoBase64 { get; set; } = string.Empty;
    public ExtensionArchivo ExtensionArchivo { get; set; }
    public long TamanoArchivoBytes { get; set; }
    public TipoDocumento TipoDocumento { get; set; }
    public EstadoDocumento EstadoDocumento { get; set; }
    public long? IdEntidadOrigen { get; set; }
    public TipoEntidadOrigen? TipoEntidadOrigen { get; set; }
    public DateTime FechaCreacionDocumento { get; set; }
    public DateTime? FechaActualizacionDocumento { get; set; }
    public DateTime? FechaEliminacionDocumento { get; set; }
}