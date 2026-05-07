namespace DocumentosAPI.Domain.DTOS.Request;

using DocumentosAPI.Domain.Enums;

public class DocumentoActualizarRequest
{
    public string NuevoContenidoBase64 { get; set; } = string.Empty;
    public ExtensionArchivo NuevaExtensionArchivo { get; set; }
    public long NuevoTamanoArchivoBytes { get; set; }
}