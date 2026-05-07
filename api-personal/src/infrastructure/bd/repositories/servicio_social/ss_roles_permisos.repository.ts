import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SsRolesPermisosEntity } from '../../entities/servicio_social/ss_roles_permisos.entity';
import { SsRolesEntity } from '../../entities/servicio_social/ss_roles..entity';
import { SsPermisosEntity } from '../../entities/servicio_social/ss_permisos.entity';
import { SsRolesPermisos } from '../../../../dtos/POCOS/servicio_social/ss_roles_permisos.poco';
import { ISsRolesPermisosRepository } from '../../../../domain/interfaces/servicio_social/ss_roles_permisos.interface';
import { CrearSsRolPermisoDto } from '../../../../dtos/requests/Servicio Social/Roles_Permisos/crear_ss_roles_permisos.dto';
import { ActualizarSsRolPermisoDto } from '../../../../dtos/requests/Servicio Social/Roles_Permisos/actualizar_ss_roles_permisos.dto';
import { DbStatus } from '../../../modules/bd.module';

@Injectable()
export class SsRolesPermisosRepository
  implements ISsRolesPermisosRepository
{
  constructor(
    @InjectRepository(SsRolesPermisosEntity, 'DB_PRINCIPAL')
    private readonly repoPrincipal: Repository<SsRolesPermisosEntity>,

    @InjectRepository(SsRolesPermisosEntity, 'DB_REPLICA')
    private readonly repoReplica: Repository<SsRolesPermisosEntity>,
  ) {}

  private MapearEntidadADominio(row: any): SsRolesPermisos {
    return new SsRolesPermisos(
      Number(row.id),
      Number(row.id_ss_rol),
      row.nombre_rol,
      Number(row.id_ss_permiso),
      row.nombre_permiso,
    );
  }

  private validarReplica() {
    if (!DbStatus.isReplicaAvailable()) {
      throw new ServiceUnavailableException(
        'El modelo de lectura no está disponible en este momento, intente más tarde',
      );
    }
  }

  private ConstruirQuery(tipo: 'principal' | 'replica' = 'replica') {
    const repo =
      tipo === 'principal' ? this.repoPrincipal : this.repoReplica;

    return repo
      .createQueryBuilder('roles_permisos')
      .leftJoin(
        SsRolesEntity,
        'rol',
        'rol.id = roles_permisos.id_ss_rol',
      )
      .leftJoin(
        SsPermisosEntity,
        'permiso',
        'permiso.id = roles_permisos.id_ss_permiso',
      )
      .select([
        'roles_permisos.id AS id',
        'roles_permisos.id_ss_rol AS id_ss_rol',
        'rol.rol AS nombre_rol',
        'roles_permisos.id_ss_permiso AS id_ss_permiso',
        'permiso.permiso AS nombre_permiso',
      ]);
  }

  // ─────────────────────────────
  // QUERIES → SOLO RÉPLICA
  // ─────────────────────────────

  async ObtenerTodos(): Promise<SsRolesPermisos[]> {
    this.validarReplica();

    const results = await this.ConstruirQuery('replica').getRawMany();
    return results.map((row) => this.MapearEntidadADominio(row));
  }

  async ObtenerPorId(id: number): Promise<SsRolesPermisos | null> {
    this.validarReplica();

    const row = await this.ConstruirQuery('replica')
      .where('roles_permisos.id = :id', { id })
      .getRawOne();

    return row ? this.MapearEntidadADominio(row) : null;
  }

  async ObtenerPorRol(idRol: number): Promise<SsRolesPermisos[]> {
    this.validarReplica();

    const results = await this.ConstruirQuery('replica')
      .where('roles_permisos.id_ss_rol = :idRol', { idRol })
      .getRawMany();

    return results.map((row) => this.MapearEntidadADominio(row));
  }

  async ObtenerPorPermiso(idPermiso: number): Promise<SsRolesPermisos[]> {
    this.validarReplica();

    const results = await this.ConstruirQuery('replica')
      .where('roles_permisos.id_ss_permiso = :idPermiso', { idPermiso })
      .getRawMany();

    return results.map((row) => this.MapearEntidadADominio(row));
  }

  // ─────────────────────────────
  // COMMANDS → SOLO PRINCIPAL
  // ─────────────────────────────

  async Crear(dto: CrearSsRolPermisoDto): Promise<SsRolesPermisos> {
    const entity = this.repoPrincipal.create({
      id_ss_rol: dto.id_ss_rol,
      id_ss_permiso: dto.id_ss_permiso,
    });

    const entityGuardada = await this.repoPrincipal.save(entity);

    const result = await this.ConstruirQuery('principal')
      .where('roles_permisos.id = :id', {
        id: Number(entityGuardada.id),
      })
      .getRawOne();

    return this.MapearEntidadADominio(result);
  }

  async Eliminar(id: number): Promise<void> {
    await this.repoPrincipal.delete(id);
  }

  async Actualizar(
    id: number,
    dto: ActualizarSsRolPermisoDto,
  ): Promise<SsRolesPermisos> {
    const entity = await this.repoPrincipal.findOne({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException(
        `No se encontró la asignación rol-permiso con id ${id}`,
      );
    }

    if (dto.id_ss_rol !== undefined)
      entity.id_ss_rol = dto.id_ss_rol;

    if (dto.id_ss_permiso !== undefined)
      entity.id_ss_permiso = dto.id_ss_permiso;

    const entityActualizada = await this.repoPrincipal.save(entity);

    const result = await this.ConstruirQuery('principal')
      .where('roles_permisos.id = :id', {
        id: Number(entityActualizada.id),
      })
      .getRawOne();

    return this.MapearEntidadADominio(result);
  }
}