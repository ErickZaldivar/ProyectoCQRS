import {
  Injectable,
  ServiceUnavailableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Not, Repository } from 'typeorm';
import { SsOrganizacionesEntity } from '../../entities/servicio_social/ss_organizaciones.entity';
import { SsOrganizaciones } from '../../../../dtos/POCOS/servicio_social/ss_organizaciones.poco';
import { ISsOrganizacionesRepository } from '../../../../domain/interfaces/servicio_social/ss_organizaciones';
import { CrearSsOrganizacionDto } from '../../../../dtos/requests/Servicio Social/Organizaciones/Crear_Organoiazciones_DTO';
import { ActualizarSsOrganizacionDto } from '../../../../dtos/requests/Servicio Social/Organizaciones/Actualizar_Organizaciones_DTO';
import { DbStatus } from '../../../modules/bd.module';

@Injectable()
export class SsOrganizacionesRepository
  implements ISsOrganizacionesRepository
{
  constructor(
    @InjectRepository(SsOrganizacionesEntity, 'DB_PRINCIPAL')
    private readonly repoPrincipal: Repository<SsOrganizacionesEntity>,

    @InjectRepository(SsOrganizacionesEntity, 'DB_REPLICA')
    private readonly repoReplica: Repository<SsOrganizacionesEntity>,
  ) {}

  private MapearEntidadADominio(
    entity: SsOrganizacionesEntity,
  ): SsOrganizaciones {
    return new SsOrganizaciones(
      entity.id,
      entity.nombre_organizacion,
      entity.nombre_titular_organizacion,
      entity.puesto_titular_organizaciones,
    );
  }

  private validarReplica() {
    if (!DbStatus.isReplicaAvailable()) {
      throw new ServiceUnavailableException(
        'El modelo de lectura no está disponible en este momento, intente más tarde',
      );
    }
  }

  async ObtenerTodos(): Promise<SsOrganizaciones[]> {
    try {
      this.validarReplica();

      const entities = await this.repoReplica.find();
      return entities.map((e) => this.MapearEntidadADominio(e));
    } catch {
      DbStatus.disableReplica();
      throw new ServiceUnavailableException(
        'El modelo de lectura no está disponible en este momento, intente más tarde',
      );
    }
  }

  async ObtenerPorId(id: number): Promise<SsOrganizaciones | null> {
    try {
      this.validarReplica();

      const entity = await this.repoReplica.findOne({ where: { id } });
      return entity ? this.MapearEntidadADominio(entity) : null;
    } catch {
      DbStatus.disableReplica();
      throw new ServiceUnavailableException(
        'El modelo de lectura no está disponible en este momento, intente más tarde',
      );
    }
  }

  async ObtenerPorNombreOrganizacion(
    nombre: string,
  ): Promise<SsOrganizaciones[]> {
    try {
      this.validarReplica();

      const entities = await this.repoReplica.find({
        where: { nombre_organizacion: ILike(`%${nombre}%`) },
      });

      return entities.map((e) => this.MapearEntidadADominio(e));
    } catch {
      DbStatus.disableReplica();
      throw new ServiceUnavailableException(
        'El modelo de lectura no está disponible en este momento, intente más tarde',
      );
    }
  }

  async ObtenerPorNombreTitular(
    nombreTitular: string,
  ): Promise<SsOrganizaciones[]> {
    try {
      this.validarReplica();

      const entities = await this.repoReplica.find({
        where: { nombre_titular_organizacion: ILike(`%${nombreTitular}%`) },
      });

      return entities.map((e) => this.MapearEntidadADominio(e));
    } catch {
      DbStatus.disableReplica();
      throw new ServiceUnavailableException(
        'El modelo de lectura no está disponible en este momento, intente más tarde',
      );
    }
  }

  async ObtenerEnPrincipalPorId(
    id: number,
  ): Promise<SsOrganizaciones | null> {
    const entity = await this.repoPrincipal.findOne({ where: { id } });
    return entity ? this.MapearEntidadADominio(entity) : null;
  }

  async ExisteEnPrincipalPorNombre(nombre: string): Promise<boolean> {
    const entity = await this.repoPrincipal.findOne({
      where: { nombre_organizacion: ILike(nombre) },
    });

    return !!entity;
  }

  async ExisteEnPrincipalPorNombreExcluyendoId(
    nombre: string,
    id: number,
  ): Promise<boolean> {
    const entity = await this.repoPrincipal.findOne({
      where: {
        nombre_organizacion: ILike(nombre),
        id: Not(id),
      },
    });

    return !!entity;
  }

  async Crear(dto: CrearSsOrganizacionDto): Promise<SsOrganizaciones> {
    const entity = this.repoPrincipal.create({
      nombre_organizacion: dto.nombre_organizacion,
      nombre_titular_organizacion: dto.nombre_titular_organizacion,
      puesto_titular_organizaciones: dto.puesto_titular_organizaciones,
    });

    const entityGuardada = await this.repoPrincipal.save(entity);
    return this.MapearEntidadADominio(entityGuardada);
  }

  async Eliminar(id: number): Promise<number> {
    const result = await this.repoPrincipal.delete(id);
    return result.affected ?? 0;
  }

  async EliminarPorNombre(nombre: string): Promise<number> {
    const result = await this.repoPrincipal.delete({
      nombre_organizacion: ILike(`%${nombre}%`),
    });

    return result.affected ?? 0;
  }

  async Actualizar(
    id: number,
    dto: ActualizarSsOrganizacionDto,
  ): Promise<SsOrganizaciones> {
    const entity = await this.repoPrincipal.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(
        `No se encontró la organización con id ${id}`,
      );
    }

    if (dto.nombre_organizacion !== undefined)
      entity.nombre_organizacion = dto.nombre_organizacion;

    if (dto.nombre_titular_organizacion !== undefined)
      entity.nombre_titular_organizacion = dto.nombre_titular_organizacion;

    if (dto.puesto_titular_organizaciones !== undefined)
      entity.puesto_titular_organizaciones =
        dto.puesto_titular_organizaciones;

    const entityActualizada = await this.repoPrincipal.save(entity);
    return this.MapearEntidadADominio(entityActualizada);
  }
}