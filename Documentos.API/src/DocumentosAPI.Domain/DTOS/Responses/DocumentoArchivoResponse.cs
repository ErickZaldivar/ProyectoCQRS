namespace DocumentosAPI.Domain.DTOS.Responses;

using DocumentosAPI.Domain.Enums;

public class DocumentoArchivoResponse
{
    public Guid DocumentoId { get; set; }
    public string NombreArchivo { get; set; } = string.Empty;
    public string ContenidoBase64 { get; set; } = string.Empty;
    public ExtensionArchivo ExtensionArchivo { get; set; }
    public TipoDocumento TipoDocumento { get; set; }
    public long? IdEntidadOrigen { get; set; }
    public TipoEntidadOrigen? TipoEntidadOrigen { get; set; }
}