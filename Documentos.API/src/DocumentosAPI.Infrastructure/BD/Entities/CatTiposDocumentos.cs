namespace DocumentosAPI.Infrastructure.BD.Entities;

public class CatTipoDocumentoEntity
{
    public short Id { get; set; }
    public string NombreTipoDocumento { get; set; } = string.Empty;
    public string DescripcionTipo { get; set; } = string.Empty;
    public ICollection<DocumentoEntity> Documentos { get; set; } = new List<DocumentoEntity>();
}