namespace DocumentosAPI.Infrastructure.BD.Entities;

public class CatEstadoDocumentoEntity
{
    public short Id { get; set; }
    public string NombreEstadoDocumento { get; set; } = string.Empty;
    public ICollection<DocumentoEntity> Documentos { get; set; } = new List<DocumentoEntity>();
}