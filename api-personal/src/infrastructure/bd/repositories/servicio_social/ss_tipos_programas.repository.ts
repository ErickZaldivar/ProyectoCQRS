import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { SsTiposProgramasEntity } from '../../entities/servicio_social/ss_tipos_programas.entity';
import { SsTiposProgramas } from '../../../../dtos/POCOS/servicio_social/ss_tipos_programas.poco';
import { ISsTiposProgramasRepository } from '../../../../domain/interfaces/servicio_social/ss_tipos_programas.interface';
import { CrearSsTipoProgramaDto } from '../../../../dtos/requests/Servicio Social/Tipos_Programas/crear_ss_tipos_programas';
import { ActualizarSsTipoProgramaDto } from '../../../../dtos/requests/Servicio Social/Tipos_Programas/actualizar_ss_tipos_programas';
import { DbStatus } from '../../../modules/bd.module';

@Injectable()
export class SsTiposProgramasRepository
  implements ISsTiposProgramasRepository
{
  constructor(
    @InjectRepository(SsTiposProgramasEntity, 'DB_PRINCIPAL')
    private readonly repoPrincipal: Repository<SsTiposProgramasEntity>,

    @InjectRepository(SsTiposProgramasEntity, 'DB_REPLICA')
    private readonly repoReplica: Repository<SsTiposProgramasEntity>,
  ) {}

  private MapearEntidadADominio(
    entity: SsTiposProgramasEntity,
  ): SsTiposProgramas {
    return new SsTiposProgramas(Number(entity.id), entity.nombre_tipo);
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

  async ObtenerTodos(): Promise<SsTiposProgramas[]> {
    this.validarReplica();

    const entities = await this.repoReplica.find();
    return entities.map((entity) =>
      this.MapearEntidadADominio(entity),
    );
  }

  async ObtenerPorId(
    id: number,
  ): Promise<SsTiposProgramas | null> {
    this.validarReplica();

    const entity = await this.repoReplica.findOne({
      where: { id },
    });

    return entity
      ? this.MapearEntidadADominio(entity)
      : null;
  }

  async ObtenerPorNombreTipo(
    nombreTipo: string,
  ): Promise<SsTiposProgramas[]> {
    this.validarReplica();

    const entities = await this.repoReplica.find({
      where: {
        nombre_tipo: ILike(`%${nombreTipo}%`),
      },
    });

    return entities.map((entity) =>
      this.MapearEntidadADominio(entity),
    );
  }

  // ─────────────────────────────
  // COMMANDS → SOLO PRINCIPAL
  // ─────────────────────────────

  async Crear(
    dto: CrearSsTipoProgramaDto,
  ): Promise<SsTiposProgramas> {
    const entity = this.repoPrincipal.create({
      nombre_tipo: dto.nombre_tipo,
    });

    const entityGuardada =
      await this.repoPrincipal.save(entity);

    return this.MapearEntidadADominio(entityGuardada);
  }

  async Eliminar(id: number): Promise<void> {
    const entity = await this.repoPrincipal.findOne({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException(
        `No se encontró el tipo de programa con id ${id}`,
      );
    }

    await this.repoPrincipal.delete(id);
  }

  async EliminarPorNombre(nombreTipo: string): Promise<void> {
    const entities = await this.repoPrincipal.find({
      where: {
        nombre_tipo: ILike(`%${nombreTipo}%`),
      },
    });

    if (!entities || entities.length === 0) {
      throw new NotFoundException(
        `No se encontró ningún tipo de programa con el nombre ${nombreTipo}`,
      );
    }

    await this.repoPrincipal.delete(
      entities.map((entity) => entity.id),
    );
  }

  async Actualizar(
    id: number,
    dto: ActualizarSsTipoProgramaDto,
  ): Promise<SsTiposProgramas> {
    const entity = await this.repoPrincipal.findOne({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException(
        `No se encontró el tipo de programa con id ${id}`,
      );
    }

    if (dto.nombre_tipo !== undefined) {
      entity.nombre_tipo = dto.nombre_tipo;
    }

    const entityActualizada =
      await this.repoPrincipal.save(entity);

    return this.MapearEntidadADominio(entityActualizada);
  }
}