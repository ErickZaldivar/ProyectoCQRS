namespace DocumentosAPI.Application.Validators;

using DocumentosAPI.Domain.DTOS.Request;
using FluentValidation;

public class ReemplazarArchivoDocumentoValidator : AbstractValidator<DocumentoActualizarRequest>
{
    private const long TamanoMaximoArchivoBytes = 10 * 1024 * 1024;

    public ReemplazarArchivoDocumentoValidator()
    {
        RuleFor(documento => documento.NuevoContenidoBase64)
            .NotEmpty().WithMessage("El nuevo contenido del archivo en Base64 es obligatorio.");

        RuleFor(documento => documento.NuevaExtensionArchivo)
            .IsInEnum().WithMessage("La extensión del archivo no es válida.");

        RuleFor(documento => documento.NuevoTamanoArchivoBytes)
            .GreaterThan(0).WithMessage("El tamaño del archivo debe ser mayor a 0 bytes.")
            .LessThanOrEqualTo(TamanoMaximoArchivoBytes).WithMessage("El archivo no puede superar los 10 MB.");
    }
}