namespace DocumentosAPI.Application.Mappings;

using AutoMapper;
using DocumentosAPI.Domain.DTOS.Responses;
using DocumentosAPI.Domain.Entities;

public class DocumentoMappingProfile : Profile
{
    public DocumentoMappingProfile()
    {
        CreateMap<Documento, DocumentoResponse>()
            .ForMember(
                destino => destino.DocumentoId,
                origen => origen.MapFrom(src => src.Id))
            .ForMember(
                destino => destino.NombreArchivo,
                origen => origen.MapFrom(src => src.NombreArchivo))
            .ForMember(
                destino => destino.ExtensionArchivo,
                origen => origen.MapFrom(src => src.ExtensionArchivo))
            .ForMember(
                destino => destino.TamanoArchivoBytes,
                origen => origen.MapFrom(src => src.TamanoArchivoBytes))
            .ForMember(
                destino => destino.TipoDocumento,
                origen => origen.MapFrom(src => src.TipoDocumento))
            .ForMember(
                destino => destino.EstadoDocumento,
                origen => origen.MapFrom(src => src.EstadoDocumento))
            .ForMember(
                destino => destino.IdEntidadOrigen,
                origen => origen.MapFrom(src => src.IdEntidadOrigen))
            .ForMember(
                destino => destino.TipoEntidadOrigen,
                origen => origen.MapFrom(src => src.TipoEntidadOrigen))
            .ForMember(
                destino => destino.FechaCreacionDocumento,
                origen => origen.MapFrom(src => src.FechaCreacionDocumento))
            .ForMember(
                destino => destino.FechaActualizacionDocumento,
                origen => origen.MapFrom(src => src.FechaActualizacionDocumento));

        CreateMap<Documento, DocumentoArchivoResponse>()
            .ForMember(
                destino => destino.DocumentoId,
                origen => origen.MapFrom(src => src.Id))
            .ForMember(
                destino => destino.NombreArchivo,
                origen => origen.MapFrom(src => src.NombreArchivo))
            .ForMember(
                destino => destino.ContenidoBase64,
                origen => origen.MapFrom(src => src.ContenidoBase64))
            .ForMember(
                destino => destino.ExtensionArchivo,
                origen => origen.MapFrom(src => src.ExtensionArchivo))
            .ForMember(
                destino => destino.TipoDocumento,
                origen => origen.MapFrom(src => src.TipoDocumento))
            .ForMember(
                destino => destino.IdEntidadOrigen,
                origen => origen.MapFrom(src => src.IdEntidadOrigen))
            .ForMember(
                destino => destino.TipoEntidadOrigen,
                origen => origen.MapFrom(src => src.TipoEntidadOrigen));
    }
}