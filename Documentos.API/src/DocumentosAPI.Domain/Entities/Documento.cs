namespace DocumentosAPI.Domain.Entities;

using DocumentosAPI.Domain.Enums;

public class Documento
{
    public Guid Id { get; private set; }
    public string NombreArchivo { get; private set; } = string.Empty;
    public string ContenidoBase64 { get; private set; } = string.Empty;
    public ExtensionArchivo ExtensionArchivo { get; private set; }
    public long TamanoArchivoBytes { get; private set; }
    public TipoDocumento TipoDocumento { get; private set; }
    public EstadoDocumento EstadoDocumento { get; private set; }
    public long? IdEntidadOrigen { get; private set; }
    public TipoEntidadOrigen? TipoEntidadOrigen { get; private set; }
    public DateTime FechaCreacionDocumento { get; private set; }
    public DateTime? FechaActualizacionDocumento { get; private set; }
    public DateTime? FechaEliminacionDocumento { get; private set; }

    private Documento() { }

    public static Documento CrearNuevoDocumento(
        string nombreArchivo,
        string contenidoBase64,
        ExtensionArchivo extensionArchivo,
        long tamanoArchivoBytes,
        TipoDocumento tipoDocumento,
        long? idEntidadOrigen,
        TipoEntidadOrigen? tipoEntidadOrigen)
    {
        return new Documento
        {
            Id                     = Guid.NewGuid(),
            NombreArchivo          = nombreArchivo,
            ContenidoBase64        = contenidoBase64,
            ExtensionArchivo       = extensionArchivo,
            TamanoArchivoBytes     = tamanoArchivoBytes,
            TipoDocumento          = tipoDocumento,
            EstadoDocumento        = EstadoDocumento.Activo,
            IdEntidadOrigen        = idEntidadOrigen,
            TipoEntidadOrigen      = tipoEntidadOrigen,
            FechaCreacionDocumento = DateTime.UtcNow
        };
    }

    public void ReemplazarArchivoDocumento(
        string nuevoContenidoBase64,
        ExtensionArchivo nuevaExtensionArchivo,
        long nuevoTamanoArchivoBytes)
    {
        ContenidoBase64             = nuevoContenidoBase64;
        ExtensionArchivo            = nuevaExtensionArchivo;
        TamanoArchivoBytes          = nuevoTamanoArchivoBytes;
        FechaActualizacionDocumento = DateTime.UtcNow;
    }

    public void EliminarDocumentoLogicamente()
    {
        EstadoDocumento           = EstadoDocumento.Eliminado;
        FechaEliminacionDocumento = DateTime.UtcNow;
    }

    public static Documento ReconstruirDocumento(DocumentoReconstruccionParams parametros)
    {
        return new Documento
        {
            Id                          = parametros.Id,
            NombreArchivo               = parametros.NombreArchivo,
            ContenidoBase64             = parametros.ContenidoBase64,
            ExtensionArchivo            = parametros.ExtensionArchivo,
            TamanoArchivoBytes          = parametros.TamanoArchivoBytes,
            TipoDocumento               = parametros.TipoDocumento,
            EstadoDocumento             = parametros.EstadoDocumento,
            IdEntidadOrigen             = parametros.IdEntidadOrigen,
            TipoEntidadOrigen           = parametros.TipoEntidadOrigen,
            FechaCreacionDocumento      = parametros.FechaCreacionDocumento,
            FechaActualizacionDocumento = parametros.FechaActualizacionDocumento,
            FechaEliminacionDocumento   = parametros.FechaEliminacionDocumento
        };
    }
}