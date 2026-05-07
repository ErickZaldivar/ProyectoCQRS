namespace DocumentosAPI.Application.Logic.Documentos;

using AutoMapper;
using DocumentosAPI.Application.Interfaces;
using DocumentosAPI.Domain.DTOS.Request;
using DocumentosAPI.Domain.DTOS.Responses;
using DocumentosAPI.Domain.Entities;
using DocumentosAPI.Domain.Enums;
using DocumentosAPI.Domain.Exceptions;
using DocumentosAPI.Domain.Interfaces;

public class DocumentoLogic : IDocumentos
{
    private readonly IDocumentoRepository _documentoRepository;
    private readonly IMapper _mapper;

    public DocumentoLogic(IDocumentoRepository documentoRepository, IMapper mapper)
    {
        _documentoRepository = documentoRepository;
        _mapper              = mapper;
    }

    public async Task<DocumentoResponse> SubirDocumentoAsync(DocumentoRequest documentoRequest)
    {
        Documento nuevoDocumento = Documento.CrearNuevoDocumento(
            documentoRequest.NombreArchivo,
            documentoRequest.ContenidoBase64,
            documentoRequest.ExtensionArchivo,
            documentoRequest.TamanoArchivoBytes,
            documentoRequest.TipoDocumento,
            documentoRequest.IdEntidadOrigen,
            documentoRequest.TipoEntidadOrigen
        );

        Documento documentoGuardado = await _documentoRepository.GuardarDocumentoAsync(nuevoDocumento);

        return _mapper.Map<DocumentoResponse>(documentoGuardado);
    }

    public async Task<DocumentoArchivoResponse> DescargarDocumentoAsync(Guid documentoId)
    {
        Documento documentoEncontrado = await _documentoRepository.ObtenerDocumentoPorIdAsync(documentoId);

        if (documentoEncontrado is null)
            throw new DocumentoNoEncontradoException(documentoId);

        return _mapper.Map<DocumentoArchivoResponse>(documentoEncontrado);
    }

    public async Task<DocumentoResponse> ReemplazarArchivoDocumentoAsync(
        Guid documentoId,
        DocumentoActualizarRequest documentoActualizarRequest)
    {
        Documento documentoExistente = await _documentoRepository.ObtenerDocumentoPorIdAsync(documentoId);

        if (documentoExistente is null)
            throw new DocumentoNoEncontradoException(documentoId);

        if (documentoExistente.EstadoDocumento == EstadoDocumento.Eliminado)
            throw new DocumentoYaEliminadoException(documentoId);

        documentoExistente.ReemplazarArchivoDocumento(
            documentoActualizarRequest.NuevoContenidoBase64,
            documentoActualizarRequest.NuevaExtensionArchivo,
            documentoActualizarRequest.NuevoTamanoArchivoBytes
        );

        Documento documentoActualizado = await _documentoRepository.ActualizarDocumentoAsync(documentoExistente);

        return _mapper.Map<DocumentoResponse>(documentoActualizado);
    }

    public async Task<bool> EliminarDocumentoAsync(Guid documentoId)
    {
        Documento documentoExistente = await _documentoRepository.ObtenerDocumentoPorIdAsync(documentoId);

        if (documentoExistente is null)
            throw new DocumentoNoEncontradoException(documentoId);

        if (documentoExistente.EstadoDocumento == EstadoDocumento.Eliminado)
            throw new DocumentoYaEliminadoException(documentoId);

        return await _documentoRepository.EliminarDocumentoPorIdAsync(documentoId);
    }
}