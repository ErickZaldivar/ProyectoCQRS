import {
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISsSeguimientoAlumnosRepository } from '../../../../domain/interfaces/servicio_social/ss_seguimiento_alumnos.interface';
import { SsSeguimientoAlumnosEntity } from '../../entities/servicio_social/ss_seguimiento_alumnos.entity';
import { SsSeguimientoAlumnosPoco } from '../../../../dtos/POCOS/servicio_social/ss_seguimiento_alumnos.poco';
import { CrearSsSeguimientoAlumnosDto } from '../../../../dtos/requests/Servicio Social/SeguimientoAlumnos/crear_ss_seguimiento_alumnos.dto';
import { DbStatus } from '../../../modules/bd.module';

@Injectable()
export class SsSeguimientoAlumnosRepository
  implements ISsSeguimientoAlumnosRepository
{
  constructor(
    @InjectRepository(SsSeguimientoAlumnosEntity, 'DB_PRINCIPAL')
    private readonly repoPrincipal: Repository<SsSeguimientoAlumnosEntity>,

    @InjectRepository(SsSeguimientoAlumnosEntity, 'DB_REPLICA')
    private readonly repoReplica: Repository<SsSeguimientoAlumnosEntity>,
  ) {}

  private mapToPoco(
    entidad: SsSeguimientoAlumnosEntity,
  ): SsSeguimientoAlumnosPoco {
    const poco = new SsSeguimientoAlumnosPoco();
    poco.id = Number(entidad.id);
    poco.id_alumno_academico = Number(entidad.id_alumno_academico);
    poco.id_programa = Number(entidad.id_programa);
    poco.id_periodo_escolar = Number(entidad.id_periodo_escolar);
    return poco;
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

  async ObtenerTodos(): Promise<SsSeguimientoAlumnosPoco[]> {
    this.validarReplica();

    const entidades = await this.repoReplica.find();
    return entidades.map((entidad) => this.mapToPoco(entidad));
  }

  async ObtenerPorId(
    id: number,
  ): Promise<SsSeguimientoAlumnosPoco | null> {
    this.validarReplica();

    const entidad = await this.repoReplica.findOne({
      where: { id },
    });

    return entidad ? this.mapToPoco(entidad) : null;
  }

  async ObtenerPorIdAlumnoAcademico(
    id_alumno_academico: number,
  ): Promise<SsSeguimientoAlumnosPoco[]> {
    this.validarReplica();

    const entidades = await this.repoReplica.find({
      where: { id_alumno_academico },
    });

    return entidades.map((entidad) => this.mapToPoco(entidad));
  }

  async ObtenerPorIdPrograma(
    id_programa: number,
  ): Promise<SsSeguimientoAlumnosPoco[]> {
    this.validarReplica();

    const entidades = await this.repoReplica.find({
      where: { id_programa },
    });

    return entidades.map((entidad) => this.mapToPoco(entidad));
  }

  // ─────────────────────────────
  // COMMANDS → SOLO PRINCIPAL
  // ─────────────────────────────

  async Crear(
    dto: CrearSsSeguimientoAlumnosDto,
  ): Promise<SsSeguimientoAlumnosPoco> {
    const entity = this.repoPrincipal.create({
      id_alumno_academico: dto.id_alumno_academico,
      id_programa: dto.id_programa,
      id_periodo_escolar: dto.id_periodo_escolar,
    });

    const entityGuardada = await this.repoPrincipal.save(entity);
    return this.mapToPoco(entityGuardada);
  }

  async Eliminar(id: number): Promise<void> {
    await this.repoPrincipal.delete(id);
  }
}