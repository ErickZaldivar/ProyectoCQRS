namespace DocumentosAPI.Domain.Exceptions;

public class DocumentoNoEncontradoException : Exception
{
    public DocumentoNoEncontradoException(Guid documentoId)
        : base($"No se encontró ningún documento con el ID: {documentoId}")
    { }
}
