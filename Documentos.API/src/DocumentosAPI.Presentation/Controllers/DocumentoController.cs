using DocumentosAPI.Application.Interfaces;
using DocumentosAPI.Domain.DTOS.Request;
using DocumentosAPI.Domain.DTOS.Responses;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class DocumentosController : ControllerBase
{
    private readonly IDocumentos _documentoLogic;
    private readonly IValidator<DocumentoRequest> _subirDocumentoValidator;
    private readonly IValidator<DocumentoActualizarRequest> _reemplazarArchivoValidator;

    public DocumentosController(
        IDocumentos documentoLogic,
        IValidator<DocumentoRequest> subirDocumentoValidator,
        IValidator<DocumentoActualizarRequest> reemplazarArchivoValidator)
    {
        _documentoLogic             = documentoLogic;
        _subirDocumentoValidator    = subirDocumentoValidator;
        _reemplazarArchivoValidator = reemplazarArchivoValidator;
    }

    [HttpPost]
[   ProducesResponseType(typeof(DocumentoResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> SubirDocumentoAsync([FromBody] DocumentoRequest documentoRequestDTO)
    {
        ValidationResult resultadoValidacion = await _subirDocumentoValidator.ValidateAsync(documentoRequestDTO);

        if (!resultadoValidacion.IsValid)
            return BadRequest(new
        {
            success = false,
            errors  = resultadoValidacion.Errors.Select(error => error.ErrorMessage)
        });

        DocumentoResponse documentoGuardado = await _documentoLogic.SubirDocumentoAsync(documentoRequestDTO);

        return Created($"/api/documentos/{documentoGuardado.DocumentoId}",
        new { success = true, data = documentoGuardado });
    }

    [HttpGet("{documentoId:guid}")]
    [ProducesResponseType(typeof(DocumentoArchivoResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DescargarDocumentoAsync(Guid documentoId)
    {
        DocumentoArchivoResponse documentoArchivo = await _documentoLogic.DescargarDocumentoAsync(documentoId);

        return Ok(new { success = true, data = documentoArchivo });
    }

    [HttpPut("{documentoId:guid}")]
    [ProducesResponseType(typeof(DocumentoResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> ReemplazarArchivoDocumentoAsync(
        Guid documentoId,
        [FromBody] DocumentoActualizarRequest documentoActualizarRequestDTO)
    {
        ValidationResult resultadoValidacion = await _reemplazarArchivoValidator.ValidateAsync(documentoActualizarRequestDTO);

        if (!resultadoValidacion.IsValid)
            return BadRequest(new
            {
                success = false,
                errors  = resultadoValidacion.Errors.Select(error => error.ErrorMessage)
            });

        DocumentoResponse documentoActualizado = await _documentoLogic.ReemplazarArchivoDocumentoAsync(
            documentoId,
            documentoActualizarRequestDTO);

        return Ok(new { success = true, data = documentoActualizado });
    }

    [HttpDelete("{documentoId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> EliminarDocumentoAsync(Guid documentoId)
    {
        await _documentoLogic.EliminarDocumentoAsync(documentoId);

        return Ok(new { success = true, message = "El documento fue eliminado correctamente." });
    }
}