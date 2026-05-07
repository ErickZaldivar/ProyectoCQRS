namespace DocumentosAPI.Integration.Tests.Fixtures;

using DocumentosAPI.Infrastructure.BD.Context;
using DocumentosAPI.Infrastructure.BD.Entities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

public class DocumentosApiFactory : WebApplicationFactory<Program>
{
    private readonly SqliteConnection _connection;

    public DocumentosApiFactory()
    {
        _connection = new SqliteConnection("Data Source=:memory:");
        _connection.Open();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Development");

        builder.ConfigureServices(services =>
        {
            var descriptorsAEliminar = services
                .Where(d =>
                    d.ServiceType.FullName != null && (
                    d.ServiceType.FullName.Contains("DbContext")       ||
                    d.ServiceType.FullName.Contains("Npgsql")          ||
                    d.ServiceType.FullName.Contains("EntityFramework") ||
                    d.ServiceType.FullName.Contains("DatabaseProvider")))
                .ToList();

            foreach (var descriptor in descriptorsAEliminar)
                services.Remove(descriptor);

            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseSqlite(_connection);
                options.EnableSensitiveDataLogging();
            });

            ServiceProvider sp = services.BuildServiceProvider();
            using IServiceScope scope = sp.CreateScope();
            AppDbContext db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            db.Database.EnsureCreated();

            SembrarCatalogos(db);
        });
    }

    private static void SembrarCatalogos(AppDbContext db)
    {
        if (!db.CatTiposDocumento.Any())
        {
            db.CatTiposDocumento.AddRange(
                new CatTipoDocumentoEntity { Id = 1, NombreTipoDocumento = "PlanTrabajo",        DescripcionTipo = "Plan de trabajo"        },
                new CatTipoDocumentoEntity { Id = 2, NombreTipoDocumento = "CartaPresentacion",  DescripcionTipo = "Carta de presentación"  },
                new CatTipoDocumentoEntity { Id = 3, NombreTipoDocumento = "CartaCompromiso",    DescripcionTipo = "Carta de compromiso"    },
                new CatTipoDocumentoEntity { Id = 4, NombreTipoDocumento = "CartaAceptacion",    DescripcionTipo = "Carta de aceptación"    },
                new CatTipoDocumentoEntity { Id = 5, NombreTipoDocumento = "SeguroFacultativo",  DescripcionTipo = "Seguro facultativo"     }
            );
        }

        if (!db.CatEstadosDocumento.Any())
        {
                db.CatEstadosDocumento.AddRange(
                new CatEstadoDocumentoEntity { Id = 1, NombreEstadoDocumento = "Activo"    },
                new CatEstadoDocumentoEntity { Id = 2, NombreEstadoDocumento = "Eliminado" }
            );
        }

        db.SaveChanges();
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);
        if (disposing)
            _connection.Dispose();
    }
}