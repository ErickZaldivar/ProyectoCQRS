namespace DocumentosAPI.Integration.Tests.Controllers;

using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using DocumentosAPI.Domain.DTOS.Request;
using DocumentosAPI.Domain.Enums;
using DocumentosAPI.Integration.Tests.Fixtures;
using FluentAssertions;

public class DocumentosControllerIntegrationTests : IClassFixture<DocumentosApiFactory>
{
    private readonly HttpClient _httpClient;

    public DocumentosControllerIntegrationTests(DocumentosApiFactory factory)
    {
        _httpClient = factory.CreateClient();
    }

    [Fact]
    public async Task SubirDocumento_ConDatosValidos_DebeRetornar201()
    {
        DocumentoRequest request = new DocumentoRequest
        {
            NombreArchivo      = "carta_presentacion_test",
            ContenidoBase64    = "JVBERi0xLjM=",
            ExtensionArchivo   = ExtensionArchivo.Pdf,
            TamanoArchivoBytes = 102400,
            TipoDocumento      = TipoDocumento.CartaPresentacion,
            IdEntidadOrigen    = 123,
            TipoEntidadOrigen  = TipoEntidadOrigen.Alumno
        };

        HttpResponseMessage response = await _httpClient.PostAsJsonAsync("/api/documentos", request);

        response.StatusCode.Should().Be(HttpStatusCode.Created);

        string contenido  = await response.Content.ReadAsStringAsync();
        JsonDocument json = JsonDocument.Parse(contenido);

        json.RootElement.GetProperty("success").GetBoolean().Should().BeTrue();
        json.RootElement.GetProperty("data").GetProperty("nombreArchivo").GetString()
            .Should().Be("carta_presentacion_test");
    }

    [Fact]
    public async Task SubirDocumento_SinNombreArchivo_DebeRetornar400()
    {
        DocumentoRequest request = new DocumentoRequest
        {
            NombreArchivo      = string.Empty,
            ContenidoBase64    = "JVBERi0xLjM=",
            ExtensionArchivo   = ExtensionArchivo.Pdf,
            TamanoArchivoBytes = 102400,
            TipoDocumento      = TipoDocumento.CartaPresentacion
        };

        HttpResponseMessage response = await _httpClient.PostAsJsonAsync("/api/documentos", request);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task SubirDocumento_SinContenidoBase64_DebeRetornar400()
    {
        DocumentoRequest request = new DocumentoRequest
        {
            NombreArchivo      = "carta_presentacion_test",
            ContenidoBase64    = string.Empty,
            ExtensionArchivo   = ExtensionArchivo.Pdf,
            TamanoArchivoBytes = 102400,
            TipoDocumento      = TipoDocumento.CartaPresentacion
        };

        HttpResponseMessage response = await _httpClient.PostAsJsonAsync("/api/documentos", request);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task SubirDocumento_ConTamanoMayorA10MB_DebeRetornar400()
    {
        DocumentoRequest request = new DocumentoRequest
        {
            NombreArchivo      = "carta_presentacion_test",
            ContenidoBase64    = "JVBERi0xLjM=",
            ExtensionArchivo   = ExtensionArchivo.Pdf,
            TamanoArchivoBytes = 11 * 1024 * 1024,
            TipoDocumento      = TipoDocumento.CartaPresentacion
        };

        HttpResponseMessage response = await _httpClient.PostAsJsonAsync("/api/documentos", request);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task SubirDocumento_ConTamanoIgualACero_DebeRetornar400()
    {
        DocumentoRequest request = new DocumentoRequest
        {
            NombreArchivo      = "carta_presentacion_test",
            ContenidoBase64    = "JVBERi0xLjM=",
            ExtensionArchivo   = ExtensionArchivo.Pdf,
            TamanoArchivoBytes = 0,
            TipoDocumento      = TipoDocumento.CartaPresentacion
        };

        HttpResponseMessage response = await _httpClient.PostAsJsonAsync("/api/documentos", request);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task SubirDocumento_SinEntidadOrigen_DebeRetornar201()
    {
        DocumentoRequest request = new DocumentoRequest
        {
            NombreArchivo      = "plan_trabajo_test",
            ContenidoBase64    = "JVBERi0xLjM=",
            ExtensionArchivo   = ExtensionArchivo.Pdf,
            TamanoArchivoBytes = 102400,
            TipoDocumento      = TipoDocumento.PlanTrabajo,
            IdEntidadOrigen    = null,
            TipoEntidadOrigen  = null
        };

        HttpResponseMessage response = await _httpClient.PostAsJsonAsync("/api/documentos", request);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
    }

    [Fact]
    public async Task SubirDocumento_ConEntidadOrigenEmpresa_DebeRetornar201()
    {
        DocumentoRequest request = new DocumentoRequest
        {
            NombreArchivo      = "carta_aceptacion_empresa",
            ContenidoBase64    = "JVBERi0xLjM=",
            ExtensionArchivo   = ExtensionArchivo.Pdf,
            TamanoArchivoBytes = 102400,
            TipoDocumento      = TipoDocumento.CartaAceptacion,
            IdEntidadOrigen    = 999,
            TipoEntidadOrigen  = TipoEntidadOrigen.Empresa
        };

        HttpResponseMessage response = await _httpClient.PostAsJsonAsync("/api/documentos", request);

        response.StatusCode.Should().Be(HttpStatusCode.Created);

        string contenido  = await response.Content.ReadAsStringAsync();
        JsonDocument json = JsonDocument.Parse(contenido);

        json.RootElement.GetProperty("data")
            .GetProperty("idEntidadOrigen").GetInt64().Should().Be(999);
    }

    [Fact]
    public async Task SubirDocumento_ConEntidadOrigenPrograma_DebeRetornar201()
    {
        DocumentoRequest request = new DocumentoRequest
        {
            NombreArchivo      = "carta_compromiso_programa",
            ContenidoBase64    = "JVBERi0xLjM=",
            ExtensionArchivo   = ExtensionArchivo.Docx,
            TamanoArchivoBytes = 102400,
            TipoDocumento      = TipoDocumento.CartaCompromiso,
            IdEntidadOrigen    = 456,
            TipoEntidadOrigen  = TipoEntidadOrigen.Programa
        };

        HttpResponseMessage response = await _httpClient.PostAsJsonAsync("/api/documentos", request);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
    }

    [Fact]
    public async Task SubirDocumento_ConExtensionDoc_DebeRetornar201()
    {
        DocumentoRequest request = new DocumentoRequest
        {
            NombreArchivo      = "documento_word_doc",
            ContenidoBase64    = "JVBERi0xLjM=",
            ExtensionArchivo   = ExtensionArchivo.Doc,
            TamanoArchivoBytes = 51200,
            TipoDocumento      = TipoDocumento.SeguroFacultativo,
            IdEntidadOrigen    = 123,
            TipoEntidadOrigen  = TipoEntidadOrigen.Alumno
        };

        HttpResponseMessage response = await _httpClient.PostAsJsonAsync("/api/documentos", request);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
    }

    [Fact]
    public async Task DescargarDocumento_ConIdValido_DebeRetornar200()
    {
        Guid documentoId = await SubirDocumentoYObtenerIdAsync();

        HttpResponseMessage response = await _httpClient.GetAsync($"/api/documentos/{documentoId}");

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        string contenido  = await response.Content.ReadAsStringAsync();
        JsonDocument json = JsonDocument.Parse(contenido);

        json.RootElement.GetProperty("success").GetBoolean().Should().BeTrue();
        json.RootElement.GetProperty("data").GetProperty("contenidoBase64").GetString()
            .Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task DescargarDocumento_ConIdInexistente_DebeRetornar404()
    {
        HttpResponseMessage response = await _httpClient.GetAsync($"/api/documentos/{Guid.NewGuid()}");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task DescargarDocumento_SinEntidadOrigen_DebeRetornarEntidadOrigenNula()
    {
        DocumentoRequest request = new DocumentoRequest
        {
            NombreArchivo      = "plan_trabajo_sin_entidad",
            ContenidoBase64    = "JVBERi0xLjM=",
            ExtensionArchivo   = ExtensionArchivo.Pdf,
            TamanoArchivoBytes = 102400,
            TipoDocumento      = TipoDocumento.PlanTrabajo,
            IdEntidadOrigen    = null,
            TipoEntidadOrigen  = null
        };

        HttpResponseMessage postResponse = await _httpClient.PostAsJsonAsync("/api/documentos", request);
        string postContenido             = await postResponse.Content.ReadAsStringAsync();
        JsonDocument postJson            = JsonDocument.Parse(postContenido);
        Guid documentoId                 = Guid.Parse(postJson.RootElement
            .GetProperty("data")
            .GetProperty("documentoId")
            .GetString()!);

        HttpResponseMessage response = await _httpClient.GetAsync($"/api/documentos/{documentoId}");

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        string contenido  = await response.Content.ReadAsStringAsync();
        JsonDocument json = JsonDocument.Parse(contenido);

        json.RootElement.GetProperty("data")
            .GetProperty("idEntidadOrigen").ValueKind.Should().Be(JsonValueKind.Null);
        json.RootElement.GetProperty("data")
            .GetProperty("tipoEntidadOrigen").ValueKind.Should().Be(JsonValueKind.Null);
    }

    [Fact]
    public async Task DescargarDocumento_DespuesDeActualizar_DebeRetornarNuevoContenido()
    {
        Guid documentoId = await SubirDocumentoYObtenerIdAsync();

        DocumentoActualizarRequest requestActualizar = new DocumentoActualizarRequest
        {
            NuevoContenidoBase64    = "ContenidoActualizado==",
            NuevaExtensionArchivo   = ExtensionArchivo.Docx,
            NuevoTamanoArchivoBytes = 204800
        };

        await _httpClient.PutAsJsonAsync($"/api/documentos/{documentoId}", requestActualizar);

        HttpResponseMessage response = await _httpClient.GetAsync($"/api/documentos/{documentoId}");

        string contenido  = await response.Content.ReadAsStringAsync();
        JsonDocument json = JsonDocument.Parse(contenido);

        json.RootElement.GetProperty("data").GetProperty("contenidoBase64").GetString()
            .Should().Be("ContenidoActualizado==");
    }

    [Fact]
    public async Task ReemplazarArchivo_ConDatosValidos_DebeRetornar200()
    {
        Guid documentoId = await SubirDocumentoYObtenerIdAsync();

        DocumentoActualizarRequest request = new DocumentoActualizarRequest
        {
            NuevoContenidoBase64    = "NuevoContenidoBase64==",
            NuevaExtensionArchivo   = ExtensionArchivo.Docx,
            NuevoTamanoArchivoBytes = 204800
        };

        HttpResponseMessage response = await _httpClient.PutAsJsonAsync(
            $"/api/documentos/{documentoId}", request);

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        string contenido  = await response.Content.ReadAsStringAsync();
        JsonDocument json = JsonDocument.Parse(contenido);

        json.RootElement.GetProperty("success").GetBoolean().Should().BeTrue();
    }

    [Fact]
    public async Task ReemplazarArchivo_SinContenidoBase64_DebeRetornar400()
    {
        Guid documentoId = await SubirDocumentoYObtenerIdAsync();

        DocumentoActualizarRequest request = new DocumentoActualizarRequest
        {
            NuevoContenidoBase64    = string.Empty,
            NuevaExtensionArchivo   = ExtensionArchivo.Pdf,
            NuevoTamanoArchivoBytes = 204800
        };

        HttpResponseMessage response = await _httpClient.PutAsJsonAsync(
            $"/api/documentos/{documentoId}", request);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task ReemplazarArchivo_ConTamanoMayorA10MB_DebeRetornar400()
    {
        Guid documentoId = await SubirDocumentoYObtenerIdAsync();

        DocumentoActualizarRequest request = new DocumentoActualizarRequest
        {
            NuevoContenidoBase64    = "JVBERi0xLjM=",
            NuevaExtensionArchivo   = ExtensionArchivo.Pdf,
            NuevoTamanoArchivoBytes = 11 * 1024 * 1024
        };

        HttpResponseMessage response = await _httpClient.PutAsJsonAsync(
            $"/api/documentos/{documentoId}", request);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task ReemplazarArchivo_VerificarFechaActualizacion_DebeRetornarFechaActualizacionNoNula()
    {
        Guid documentoId = await SubirDocumentoYObtenerIdAsync();

        DocumentoActualizarRequest request = new DocumentoActualizarRequest
        {
            NuevoContenidoBase64    = "ContenidoActualizadoNuevo==",
            NuevaExtensionArchivo   = ExtensionArchivo.Doc,
            NuevoTamanoArchivoBytes = 512000
        };

        HttpResponseMessage response = await _httpClient.PutAsJsonAsync(
            $"/api/documentos/{documentoId}", request);

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        string contenido  = await response.Content.ReadAsStringAsync();
        JsonDocument json = JsonDocument.Parse(contenido);

        json.RootElement.GetProperty("data")
            .GetProperty("fechaActualizacionDocumento").ValueKind
            .Should().NotBe(JsonValueKind.Null);
    }

    [Fact]
    public async Task ReemplazarArchivo_SobreDocumentoEliminado_DebeRetornar409()
    {
        Guid documentoId = await SubirDocumentoYObtenerIdAsync();

        await _httpClient.DeleteAsync($"/api/documentos/{documentoId}");

        DocumentoActualizarRequest request = new DocumentoActualizarRequest
        {
            NuevoContenidoBase64    = "NuevoContenidoBase64==",
            NuevaExtensionArchivo   = ExtensionArchivo.Pdf,
            NuevoTamanoArchivoBytes = 204800
        };

        HttpResponseMessage response = await _httpClient.PutAsJsonAsync(
            $"/api/documentos/{documentoId}", request);

        response.StatusCode.Should().Be(HttpStatusCode.Conflict);
    }

    [Fact]
    public async Task ReemplazarArchivo_ConIdInexistente_DebeRetornar404()
    {
        DocumentoActualizarRequest request = new DocumentoActualizarRequest
        {
            NuevoContenidoBase64    = "NuevoContenidoBase64==",
            NuevaExtensionArchivo   = ExtensionArchivo.Pdf,
            NuevoTamanoArchivoBytes = 204800
        };

        HttpResponseMessage response = await _httpClient.PutAsJsonAsync(
            $"/api/documentos/{Guid.NewGuid()}", request);

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task EliminarDocumento_ConIdValido_DebeRetornar200()
    {
        Guid documentoId = await SubirDocumentoYObtenerIdAsync();

        HttpResponseMessage response = await _httpClient.DeleteAsync($"/api/documentos/{documentoId}");

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        string contenido  = await response.Content.ReadAsStringAsync();
        JsonDocument json = JsonDocument.Parse(contenido);

        json.RootElement.GetProperty("success").GetBoolean().Should().BeTrue();
    }

    [Fact]
    public async Task EliminarDocumento_ConIdInexistente_DebeRetornar404()
    {
        HttpResponseMessage response = await _httpClient.DeleteAsync($"/api/documentos/{Guid.NewGuid()}");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task EliminarDocumento_DosVeces_DebeRetornar409()
    {
        Guid documentoId = await SubirDocumentoYObtenerIdAsync();

        await _httpClient.DeleteAsync($"/api/documentos/{documentoId}");
        HttpResponseMessage response = await _httpClient.DeleteAsync($"/api/documentos/{documentoId}");

        response.StatusCode.Should().Be(HttpStatusCode.Conflict);
    }

    private async Task<Guid> SubirDocumentoYObtenerIdAsync()
    {
        DocumentoRequest request = new DocumentoRequest
        {
            NombreArchivo      = "documento_test",
            ContenidoBase64    = "JVBERi0xLjM=",
            ExtensionArchivo   = ExtensionArchivo.Pdf,
            TamanoArchivoBytes = 102400,
            TipoDocumento      = TipoDocumento.CartaPresentacion,
            IdEntidadOrigen    = 123,
            TipoEntidadOrigen  = TipoEntidadOrigen.Alumno
        };

        HttpResponseMessage response = await _httpClient.PostAsJsonAsync("/api/documentos", request);
        string contenido             = await response.Content.ReadAsStringAsync();
        JsonDocument json            = JsonDocument.Parse(contenido);

        string documentoId = json.RootElement
            .GetProperty("data")
            .GetProperty("documentoId")
            .GetString()!;

        return Guid.Parse(documentoId);
    }
}