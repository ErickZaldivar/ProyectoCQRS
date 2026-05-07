namespace DocumentosAPI.Application.Validators;

using DocumentosAPI.Domain.DTOS.Request;
using FluentValidation;

public class SubirDocumentoValidator : AbstractValidator<DocumentoRequest>
{
    private const long TamanoMaximoArchivoBytes = 10 * 1024 * 1024;

    public SubirDocumentoValidator()
    {
        RuleFor(documento => documento.NombreArchivo)
            .NotEmpty().WithMessage("El nombre del archivo es obligatorio.")
            .MaximumLength(255).WithMessage("El nombre del archivo no puede superar los 255 caracteres.");

        RuleFor(documento => documento.ContenidoBase64)
            .NotEmpty().WithMessage("El contenido del archivo en Base64 es obligatorio.");

        RuleFor(documento => documento.ExtensionArchivo)
            .IsInEnum().WithMessage("La extensión del archivo no es válida.");

        RuleFor(documento => documento.TamanoArchivoBytes)
            .GreaterThan(0).WithMessage("El tamaño del archivo debe ser mayor a 0 bytes.")
            .LessThanOrEqualTo(TamanoMaximoArchivoBytes).WithMessage("El archivo no puede superar los 10 MB.");

        RuleFor(documento => documento.TipoDocumento)
            .IsInEnum().WithMessage("El tipo de documento no es válido.");

        RuleFor(documento => documento.TipoEntidadOrigen)
            .IsInEnum().WithMessage("El tipo de entidad origen no es válido.")
            .When(documento => documento.TipoEntidadOrigen.HasValue);
    }
}