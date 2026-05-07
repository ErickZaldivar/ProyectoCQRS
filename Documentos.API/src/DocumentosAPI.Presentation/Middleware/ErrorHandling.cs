namespace DocumentosAPI.Presentation.Middlewares;

using System.Net;
using System.Text.Json;
using DocumentosAPI.Domain.Exceptions;

public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _siguiente;

    public ErrorHandlingMiddleware(RequestDelegate siguiente)
    {
        _siguiente = siguiente;
    }

    public async Task InvokeAsync(HttpContext contextoHttp)
    {
        try
        {
            await _siguiente(contextoHttp);
        }
        catch (Exception excepcion)
        {
            await ManejarExcepcionAsync(contextoHttp, excepcion);
        }
    }

    private static async Task ManejarExcepcionAsync(HttpContext contextoHttp, Exception excepcion)
    {
        HttpStatusCode codigoEstado;
        string mensajeError;

        switch (excepcion)
        {
            case DocumentoNoEncontradoException:
                codigoEstado = HttpStatusCode.NotFound;
                mensajeError = excepcion.Message;
                break;

            case DocumentoYaEliminadoException:
                codigoEstado = HttpStatusCode.Conflict;
                mensajeError = excepcion.Message;
                break;

            default:
                codigoEstado = HttpStatusCode.InternalServerError;
                mensajeError = excepcion.InnerException?.Message ?? excepcion.Message;
                break;
        }

        contextoHttp.Response.ContentType = "application/json";
        contextoHttp.Response.StatusCode  = (int)codigoEstado;

        object respuestaError = new
        {
            success    = false,
            statusCode = (int)codigoEstado,
            message    = mensajeError
        };

        string respuestaJson = JsonSerializer.Serialize(respuestaError);

        await contextoHttp.Response.WriteAsync(respuestaJson);
    }
}