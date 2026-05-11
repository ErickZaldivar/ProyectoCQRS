namespace DocumentosAPI.Infrastructure.DependencyInjections;

using DocumentosAPI.Domain.Interfaces;
using DocumentosAPI.Infrastructure.BD.Context;
using DocumentosAPI.Infrastructure.BD.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

public static class InfrastructureServiceExtensions
{
    public static IServiceCollection AgregarInfrastructure(
        this IServiceCollection services)
    {
        string connectionString = ObtenerCadenaConexion();

        services.AddDbContext<AppDbContext>(opciones =>
            opciones.UseNpgsql(connectionString));

        services.AddScoped<IDocumentoRepository, DocumentoRepository>();

        return services;
    }

    private static string ObtenerCadenaConexion()
    {
        string dbHost     = Environment.GetEnvironmentVariable("DB_DOTNET_HOST")     ?? "localhost";
        string dbPort     = Environment.GetEnvironmentVariable("DB_DOTNET_PORT")     ?? "5432";
        string dbName     = Environment.GetEnvironmentVariable("DB_DOTNET_NAME")     ?? string.Empty;
        string dbUser     = Environment.GetEnvironmentVariable("DB_DOTNET_USER")     ?? string.Empty;
        string dbPassword = Environment.GetEnvironmentVariable("DB_DOTNET_PASSWORD") ?? string.Empty;

        return $"Host={dbHost};Port={dbPort};Database={dbName};Username={dbUser};Password={dbPassword}";
    }
}