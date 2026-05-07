using DocumentosAPI.Application.DependencyInjections;
using DocumentosAPI.Infrastructure.DependencyInjections;
using DocumentosAPI.Presentation.Middlewares;

DotNetEnv.Env.Load();

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
AppContext.SetSwitch("Npgsql.DisableDateTimeInfinityConversions", true);

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AgregarApplication();
builder.Services.AgregarInfrastructure();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(opciones =>
{
    opciones.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title       = "API Documentos",
        Version     = "v1",
        Description = "API encargada de gestionar los documentos del sistema de servicio social."
    });
});

WebApplication app = builder.Build();

app.UseMiddleware<ErrorHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(opciones =>
    {
        opciones.SwaggerEndpoint("/swagger/v1/swagger.json", "API Documentos v1");
        opciones.RoutePrefix = "swagger";
    });
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

await app.RunAsync();

public partial class Program
{
    protected Program() { }
}