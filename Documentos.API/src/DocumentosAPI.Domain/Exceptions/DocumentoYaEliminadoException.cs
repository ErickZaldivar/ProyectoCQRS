namespace DocumentosAPI.Domain.Exceptions;

public class DocumentoYaEliminadoException : Exception
{
    public DocumentoYaEliminadoException(Guid documentoId)
        : base($"El documento con el ID: {documentoId} ya fue eliminado anteriormente")
    { }
}