namespace DocumentosAPI.Infrastructure.BD.Context;

using DocumentosAPI.Infrastructure.BD.Entities;
using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> dbContextOptions) 
        : base(dbContextOptions) { }

    // Constructor protegido solo para pruebas — no afecta la app real
    protected AppDbContext(DbContextOptions dbContextOptions) 
        : base(dbContextOptions) { }

    public DbSet<DocumentoEntity> Documentos { get; set; }
    public DbSet<CatTipoDocumentoEntity> CatTiposDocumento { get; set; }
    public DbSet<CatEstadoDocumentoEntity> CatEstadosDocumento { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("gestion_documentos");

        ConfigurarTablaDocumentos(modelBuilder);
        ConfigurarTablaCatTiposDocumento(modelBuilder);
        ConfigurarTablaCatEstadosDocumento(modelBuilder);

        base.OnModelCreating(modelBuilder);
    }

    private static void ConfigurarTablaDocumentos(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<DocumentoEntity>(entidad =>
        {
            entidad.ToTable("documentos");

            entidad.HasKey(documento => documento.Id);

            entidad.Property(documento => documento.Id)
                .HasColumnName("id")
                .HasDefaultValueSql("gen_random_uuid()");

            entidad.Property(documento => documento.NombreArchivo)
                .HasColumnName("nombre_archivo")
                .HasMaxLength(255)
                .IsRequired();

            entidad.Property(documento => documento.ContenidoBase64)
                .HasColumnName("contenido_base64")
                .IsRequired();

            entidad.Property(documento => documento.ExtensionArchivo)
                .HasColumnName("extension_archivo")
                .HasMaxLength(50)
                .IsRequired();

            entidad.Property(documento => documento.TamanoArchivoBytes)
                .HasColumnName("tamano_archivo_bytes")
                .IsRequired();

            entidad.Property(documento => documento.IdTipoDocumento)
                .HasColumnName("id_tipo_documento")
                .IsRequired();

            entidad.Property(documento => documento.IdEstadoDocumento)
                .HasColumnName("id_estado_documento")
                .IsRequired()
                .HasDefaultValue((short)1);

            entidad.Property(documento => documento.FechaCreacionDocumento)
                .HasColumnName("fecha_creacion_documento")
                .IsRequired()
                .HasDefaultValueSql("NOW()");

            entidad.Property(documento => documento.FechaActualizacionDocumento)
                .HasColumnName("fecha_actualizacion_documento");

            entidad.Property(documento => documento.FechaEliminacionDocumento)
                .HasColumnName("fecha_eliminacion_documento");

            entidad.Property(documento => documento.IdEntidadOrigen)
                .HasColumnName("id_entidad_origen");

            entidad.Property(documento => documento.TipoEntidadOrigen)
                .HasColumnName("tipo_entidad_origen")
                .HasMaxLength(50);

            entidad.HasOne(documento => documento.CatTipoDocumento)
                .WithMany(tipo => tipo.Documentos)
                .HasForeignKey(documento => documento.IdTipoDocumento);

            entidad.HasOne(documento => documento.CatEstadoDocumento)
                .WithMany(estado => estado.Documentos)
                .HasForeignKey(documento => documento.IdEstadoDocumento);
        });
    }

    private static void ConfigurarTablaCatTiposDocumento(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CatTipoDocumentoEntity>(entidad =>
        {
            entidad.ToTable("cat_tipos_documento");

            entidad.HasKey(tipo => tipo.Id);

            entidad.Property(tipo => tipo.Id)
                .HasColumnName("id");

            entidad.Property(tipo => tipo.NombreTipoDocumento)
                .HasColumnName("nombre_tipo_documento")
                .HasMaxLength(100)
                .IsRequired();

            entidad.Property(tipo => tipo.DescripcionTipo)
                .HasColumnName("descripcion_tipo")
                .HasMaxLength(255);
        });
    }

    private static void ConfigurarTablaCatEstadosDocumento(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CatEstadoDocumentoEntity>(entidad =>
        {
            entidad.ToTable("cat_estados_documento");

            entidad.HasKey(estado => estado.Id);

            entidad.Property(estado => estado.Id)
                .HasColumnName("id");

            entidad.Property(estado => estado.NombreEstadoDocumento)
                .HasColumnName("nombre_estado_documento")
                .HasMaxLength(50)
                .IsRequired();
        });
    }
}