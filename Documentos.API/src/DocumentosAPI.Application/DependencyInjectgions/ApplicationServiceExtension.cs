namespace DocumentosAPI.Application.DependencyInjections;

using DocumentosAPI.Application.Interfaces;
using DocumentosAPI.Application.Logic.Documentos;
using DocumentosAPI.Application.Mappings;
using DocumentosAPI.Application.Validators;
using DocumentosAPI.Domain.DTOS.Request;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AgregarApplication(
        this IServiceCollection services)
    {
        services.AddScoped<IDocumentos, DocumentoLogic>();

        services.AddAutoMapper(typeof(DocumentoMappingProfile));

        services.AddScoped<IValidator<DocumentoRequest>, SubirDocumentoValidator>();
        services.AddScoped<IValidator<DocumentoActualizarRequest>, ReemplazarArchivoDocumentoValidator>();

        return services;
    }
}