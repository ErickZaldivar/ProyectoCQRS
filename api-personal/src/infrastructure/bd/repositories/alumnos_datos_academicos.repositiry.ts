import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlumnoDatosAcademicosEntity } from '../entities/alumnos_datos_academicos.entity';
import { AlumnoDatosAcademicos } from '../../../dtos/POCOS/alumnos_datos_academicos.entity';
import { IAlumnoDatosAcademicosRepository } from '../../../domain/interfaces/alumnos_datos_academicos.repository.interface';
import { AlumnosDatosPersonalesEntity } from '../entities/aluumnos_datos_personales.entity';
import { CarrerasEntity } from '../entities/carreras.entity';
import { DatosLoginAlumno } from '../../../dtos/POCOS/datos_logfn_alumno.poco';
import { DbStatus } from '../../modules/bd.module';

@Injectable()
export class AlumnoDatosAcademicosRepository
  implements IAlumnoDatosAcademicosRepository
{
  constructor(
    @InjectRepository(AlumnoDatosAcademicosEntity, 'DB_PRINCIPAL')
    private readonly repoPrincipal: Repository<AlumnoDatosAcademicosEntity>,

    @InjectRepository(AlumnoDatosAcademicosEntity, 'DB_REPLICA')
    private readonly repoReplica: Repository<AlumnoDatosAcademicosEntity>,
  ) {}

  private MapearEntidadADominio(
    entity: AlumnoDatosAcademicosEntity,
  ): AlumnoDatosAcademicos {
    return new AlumnoDatosAcademicos(
      entity.id,
      entity.id_alumno_personal,
      entity.no_control,
      entity.nip,
      entity.creditos_aprobados,
    );
  }

  // ─────────────────────────────────────────────
  // VALIDACIÓN DE RÉPLICA (OBLIGATORIO CQRS)
  // ─────────────────────────────────────────────
  private validarReplica() {
    if (!DbStatus.isReplicaAvailable()) {
      throw new ServiceUnavailableException(
        'El modelo de lectura no está disponible en este momento, intente más tarde',
      );
    }
  }

  // ─────────────────────────────────────────────
  // QUERIES (SOLO RÉPLICA)
  // ─────────────────────────────────────────────

  async BuscarPorNoControl(
    noControl: string,
  ): Promise<AlumnoDatosAcademicos | null> {
    this.validarReplica();

    const entity = await this.repoReplica.findOne({
      where: { no_control: noControl },
    });

    return entity ? this.MapearEntidadADominio(entity) : null;
  }

  async ObtenerDatosLoginPorNoControl(
    noControl: string,
  ): Promise<DatosLoginAlumno | null> {
    this.validarReplica();

    const row = await this.repoReplica
      .createQueryBuilder('academico')
      .leftJoin(
        AlumnosDatosPersonalesEntity,
        'personal',
        'personal.id = academico.id_alumno_personal',
      )
      .leftJoin(
        CarrerasEntity,
        'carrera',
        'carrera.id = academico.id_carrera',
      )
      .select([
        'academico.no_control AS matricula',
        'academico.creditos_aprobados AS creditos',
        'academico.semestre AS semestre',
        `CONCAT(personal.nombre, ' ', personal.apellido_paterno, ' ', personal.apellido_materno) AS nombre_completo`,
        'carrera.nombre_completo AS carrera',
      ])
      .where('academico.no_control = :noControl', { noControl })
      .getRawOne();

    if (!row) return null;

    return new DatosLoginAlumno(
      row.nombre_completo,
      row.matricula,
      Number(row.creditos),
      row.carrera,
      Number(row.semestre),
    );
  }
}