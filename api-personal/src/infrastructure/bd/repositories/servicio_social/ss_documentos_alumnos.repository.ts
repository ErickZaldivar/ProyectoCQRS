import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISsDocumentosAlumnosRepository, CampoDocumento } from '../../../../domain/interfaces/servicio_social/ss_documentos_alumnos.interface';
import { SsDocumentosAlumnosEntity } from '../../entities/servicio_social/ss_documentos_alumnos.entity';
import { SsDocumentosAlumnosPoco } from '../../../../dtos/POCOS/servicio_social/ss_documentos_alumnos.poco';
import { CrearSsDocumentosAlumnosDto } from '../../../../dtos/requests/Servicio Social/DocumentosAlumnos/crear_ss_documentos_alumnos.dto';
import { ActualizarSsDocumentosAlumnosDto } from '../../../../dtos/requests/Servicio Social/DocumentosAlumnos/actualizar_ss_documentos_alumnos.dto';
import { DbStatus } from '../../../modules/bd.module';

@Injectable()
export class SsDocumentosAlumnosRepository
  implements ISsDocumentosAlumnosRepository
{
  constructor(
    @InjectRepository(SsDocumentosAlumnosEntity, 'DB_PRINCIPAL')
    private readonly repoPrincipal: Repository<SsDocumentosAlumnosEntity>,

    @InjectRepository(SsDocumentosAlumnosEntity, 'DB_REPLICA')
    private readonly repoReplica: Repository<SsDocumentosAlumnosEntity>,
  ) {}

  private mapToPoco(
    entidad: SsDocumentosAlumnosEntity,
  ): SsDocumentosAlumnosPoco {
    return new SsDocumentosAlumnosPoco(
      Number(entidad.id),
      Number(entidad.id_alumno_academico),
      Number(entidad.id_plan_trabajo),
      entidad.carta_presentacion,
      entidad.carta_compromiso,
      entidad.carta_aceptacion,
      entidad.seguro_facultativo,
    );
  }

  private validarReplica() {
    if (!DbStatus.isReplicaAvailable()) {
      throw new ServiceUnavailableException(
        'El modelo de lectura no está disponible en este momento, intente más tarde',
      );
    }
  }

  // ─── QUERIES → RÉPLICA ─────────────────────────────

  async ObtenerTodos(): Promise<SsDocumentosAlumnosPoco[]> {
    this.validarReplica();

    const entidades = await this.repoReplica.find();
    return entidades.map((e) => this.mapToPoco(e));
  }

  async ObtenerPorId(id: number): Promise<SsDocumentosAlumnosPoco | null> {
    this.validarReplica();

    const entidad = await this.repoReplica.findOne({ where: { id } });
    return entidad ? this.mapToPoco(entidad) : null;
  }

  async ObtenerPorIdAlumnoAcademico(
    id_alumno_academico: number,
  ): Promise<SsDocumentosAlumnosPoco[]> {
    this.validarReplica();

    const entidades = await this.repoReplica.find({
      where: { id_alumno_academico },
    });

    return entidades.map((e) => this.mapToPoco(e));
  }

  async ObtenerPorIdPlanTrabajo(
    id_plan_trabajo: number,
  ): Promise<SsDocumentosAlumnosPoco[]> {
    this.validarReplica();

    const entidades = await this.repoReplica.find({
      where: { id_plan_trabajo },
    });

    return entidades.map((e) => this.mapToPoco(e));
  }

  // ─── VALIDACIONES / CONSISTENCIA → PRINCIPAL ──────

  async ObtenerEnPrincipalPorId(
    id: number,
  ): Promise<SsDocumentosAlumnosPoco | null> {
    const entidad = await this.repoPrincipal.findOne({ where: { id } });
    return entidad ? this.mapToPoco(entidad) : null;
  }

  async ExisteEnPrincipalPorAlumno(
    id_alumno_academico: number,
  ): Promise<boolean> {
    const entidad = await this.repoPrincipal.findOne({
      where: { id_alumno_academico },
      select: ['id'],
    });

    return !!entidad;
  }

  // ─── COMMANDS → PRINCIPAL ─────────────────────────

  async Crear(
    dto: CrearSsDocumentosAlumnosDto,
    archivos: any,
  ): Promise<SsDocumentosAlumnosPoco> {
    const entity = this.repoPrincipal.create({
      id_alumno_academico: Number(dto.id_alumno_academico),
      id_plan_trabajo: Number(dto.id_plan_trabajo),
      carta_presentacion: archivos?.carta_presentacion?.[0]?.buffer ?? null,
      carta_compromiso: archivos?.carta_compromiso?.[0]?.buffer ?? null,
      carta_aceptacion: archivos?.carta_aceptacion?.[0]?.buffer ?? null,
      seguro_facultativo: archivos?.seguro_facultativo?.[0]?.buffer ?? null,
    });

    const entityGuardada = await this.repoPrincipal.save(entity);
    return this.mapToPoco(entityGuardada);
  }

  async Eliminar(id: number): Promise<void> {
    const entity = await this.repoPrincipal.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(
        `No se encontró el registro de documentos con id ${id}`,
      );
    }

    await this.repoPrincipal.remove(entity);
  }

  async Actualizar(
    id: number,
    dto: ActualizarSsDocumentosAlumnosDto,
    archivos: any,
  ): Promise<SsDocumentosAlumnosPoco> {
    const entity = await this.repoPrincipal.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(
        `No se encontró el registro de documentos con id ${id}`,
      );
    }

    if (dto.id_alumno_academico !== undefined) {
      entity.id_alumno_academico = Number(dto.id_alumno_academico);
    }

    if (dto.id_plan_trabajo !== undefined) {
      entity.id_plan_trabajo = Number(dto.id_plan_trabajo);
    }

    if (archivos?.carta_presentacion) {
      entity.carta_presentacion = archivos.carta_presentacion[0].buffer;
    }

    if (archivos?.carta_compromiso) {
      entity.carta_compromiso = archivos.carta_compromiso[0].buffer;
    }

    if (archivos?.carta_aceptacion) {
      entity.carta_aceptacion = archivos.carta_aceptacion[0].buffer;
    }

    if (archivos?.seguro_facultativo) {
      entity.seguro_facultativo = archivos.seguro_facultativo[0].buffer;
    }

    const entityActualizada = await this.repoPrincipal.save(entity);
    return this.mapToPoco(entityActualizada);
  }

  // 🆕 ─── LIMPIAR CAMPO INDIVIDUAL → PRINCIPAL ──────
  async LimpiarCampo(id: number, campo: CampoDocumento): Promise<void> {
    const entity = await this.repoPrincipal.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(
        `No se encontró el registro de documentos con id ${id}`,
      );
    }

    // Pone solo el campo solicitado en null, los demás no se tocan
    entity[campo] = null;

    await this.repoPrincipal.save(entity);
  }
}