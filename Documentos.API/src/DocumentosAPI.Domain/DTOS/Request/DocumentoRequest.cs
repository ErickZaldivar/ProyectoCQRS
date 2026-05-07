namespace DocumentosAPI.Domain.DTOS.Request;

using DocumentosAPI.Domain.Enums;

public class DocumentoRequest
{
    public string NombreArchivo { get; set; } = string.Empty;
    public string ContenidoBase64 { get; set; } = string.Empty;
    public ExtensionArchivo ExtensionArchivo { get; set; }
    public long TamanoArchivoBytes { get; set; }
    public TipoDocumento TipoDocumento { get; set; }
    public long? IdEntidadOrigen { get; set; }
    public TipoEntidadOrigen? TipoEntidadOrigen { get; set; }
}