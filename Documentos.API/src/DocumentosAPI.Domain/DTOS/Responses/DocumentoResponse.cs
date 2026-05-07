namespace DocumentosAPI.Domain.DTOS.Responses;

using DocumentosAPI.Domain.Enums;

public class DocumentoResponse
{
    public Guid DocumentoId { get; set; }
    public string NombreArchivo { get; set; } = string.Empty;
    public ExtensionArchivo ExtensionArchivo { get; set; }
    public long TamanoArchivoBytes { get; set; }
    public TipoDocumento TipoDocumento { get; set; }
    public EstadoDocumento EstadoDocumento { get; set; }
    public long? IdEntidadOrigen { get; set; }
    public TipoEntidadOrigen? TipoEntidadOrigen { get; set; }
    public DateTime FechaCreacionDocumento { get; set; }
    public DateTime? FechaActualizacionDocumento { get; set; }
}