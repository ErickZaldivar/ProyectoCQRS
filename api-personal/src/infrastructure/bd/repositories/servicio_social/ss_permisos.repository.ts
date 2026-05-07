import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { SsPermisosEntity } from '../../entities/servicio_social/ss_permisos.entity';
import { SsPermisos } from '../../../../dtos/POCOS/servicio_social/ss_permisos.poco';
import { ISsPermisosRepository } from '../../../../domain/interfaces/servicio_social/ss_permisos.interface';
import { CrearSsPermisosDto } from '../../../../dtos/requests/Servicio Social/Permisos/crear_ss_permisos.dto';
import { ActualizarSsPermisosDto } from '../../../../dtos/requests/Servicio Social/Permisos/actualizar_ss_permisos.dto';
import { DbStatus } from '../../../modules/bd.module';

@Injectable()
export class SsPermisosRepository implements ISsPermisosRepository {
  constructor(
    @InjectRepository(SsPermisosEntity, 'DB_PRINCIPAL')
    private readonly repoPrincipal: Repository<SsPermisosEntity>,

    @InjectRepository(SsPermisosEntity, 'DB_REPLICA')
    private readonly repoReplica: Repository<SsPermisosEntity>,
  ) {}

  private MapearEntidadADominio(entity: SsPermisosEntity): SsPermisos {
    return new SsPermisos(entity.id, entity.permiso);
  }

  private validarReplica() {
    if (!DbStatus.isReplicaAvailable()) {
      throw new ServiceUnavailableException(
        'El modelo de lectura no está disponible en este momento, intente más tarde',
      );
    }
  }

  // ─────────────────────────────
  // QUERIES → SOLO RÉPLICA
  // ─────────────────────────────

  async ObtenerTodos(): Promise<SsPermisos[]> {
    this.validarReplica();

    const entities = await this.repoReplica.find();
    return entities.map((e) => this.MapearEntidadADominio(e));
  }

  async ObtenerPorId(id: number): Promise<SsPermisos | null> {
    this.validarReplica();

    const entity = await this.repoReplica.findOne({ where: { id } });
    return entity ? this.MapearEntidadADominio(entity) : null;
  }

  async ObtenerPorNombrePermiso(permiso: string): Promise<SsPermisos[]> {
    this.validarReplica();

    const entities = await this.repoReplica.find({
      where: { permiso: ILike(`%${permiso}%`) },
    });

    return entities.map((e) => this.MapearEntidadADominio(e));
  }

  // ─────────────────────────────
  // COMMANDS → SOLO PRINCIPAL
  // ─────────────────────────────

  async Crear(dto: CrearSsPermisosDto): Promise<SsPermisos> {
    const entity = this.repoPrincipal.create({
      permiso: dto.permiso,
    });

    const entityGuardada = await this.repoPrincipal.save(entity);
    return this.MapearEntidadADominio(entityGuardada);
  }

  async Eliminar(id: number): Promise<void> {
    await this.repoPrincipal.delete(id);
  }

  async Actualizar(
    id: number,
    dto: ActualizarSsPermisosDto,
  ): Promise<SsPermisos> {
    const entity = await this.repoPrincipal.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(
        `No se encontró el permiso con id ${id}`,
      );
    }

    if (dto.permiso !== undefined) entity.permiso = dto.permiso;
    if (dto.descripcion !== undefined) entity.descripcion = dto.descripcion;

    const entityActualizada = await this.repoPrincipal.save(entity);
    return this.MapearEntidadADominio(entityActualizada);
  }
}