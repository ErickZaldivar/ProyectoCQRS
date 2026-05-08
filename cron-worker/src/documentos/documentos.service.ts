import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { SsDocumentosAlumnosEntity } from './entities/ss_documentos_alumnos.entity';
import { AlumnoDatosAcademicosEntity } from './entities/alumnos_datos_academicos.entity';
import { AlumnosDatosPersonalesEntity } from './entities/alumnos_datos_personales.entity';

@Injectable()
export class DocumentosService {
  private readonly logger = new Logger(DocumentosService.name);
  private replicaStatusLogged = false;

  constructor(
    @InjectRepository(SsDocumentosAlumnosEntity)
    private readonly documentosRepo: Repository<SsDocumentosAlumnosEntity>,

    @InjectRepository(AlumnoDatosAcademicosEntity)
    private readonly academicosRepo: Repository<AlumnoDatosAcademicosEntity>,

    @InjectRepository(AlumnosDatosPersonalesEntity)
    private readonly personalesRepo: Repository<AlumnosDatosPersonalesEntity>,
  ) {
    this.logger.log('Conectado a BD réplica');
  }

  async verificarDocumentosPendientes(): Promise<void> {
    try {
      const conPendientes = await this.documentosRepo.find({
        where: [
          { carta_presentacion: IsNull() },
          { carta_compromiso: IsNull() },
          { carta_aceptacion: IsNull() },
          { seguro_facultativo: IsNull() },
        ],
      });

      if (!this.replicaStatusLogged) {
        this.logger.log('BD réplica disponible');
        this.replicaStatusLogged = true;
      }

      if (conPendientes.length === 0) {
        return;
      }

      for (const registro of conPendientes) {
        const nombreCompleto = await this.obtenerNombreAlumno(
          registro.id_alumno_academico,
        );

        const faltantes = this.resolverDocumentosFaltantes(registro);

        this.logger.warn(
          `Alumno: ${nombreCompleto} | ` +
          `Documentos pendientes: ${faltantes.join(', ')}`,
        );
      }

    } catch (error) {
      if (error.code === 'ECONNREFUSED' || error.message?.includes('replica')) {
        if (this.replicaStatusLogged) {
          this.logger.error('BD réplica detenida o caída');
          this.replicaStatusLogged = false;
        }
        return;
      }
      
      this.logger.error(`Error en verificación: ${error.message}`);
    }
  }

  private resolverDocumentosFaltantes(
    registro: SsDocumentosAlumnosEntity,
  ): string[] {
    const faltantes: string[] = [];
    if (!registro.carta_presentacion) faltantes.push('Carta de presentación');
    if (!registro.carta_compromiso)   faltantes.push('Carta de compromiso');
    if (!registro.carta_aceptacion)   faltantes.push('Carta de aceptación');
    if (!registro.seguro_facultativo) faltantes.push('Seguro facultativo');
    return faltantes;
  }

  private async obtenerNombreAlumno(idAlumnoAcademico: number): Promise<string> {
    const academico = await this.academicosRepo.findOne({
      where: { id: idAlumnoAcademico },
    });

    if (!academico) return `Desconocido (id: ${idAlumnoAcademico})`;

    const personal = await this.personalesRepo.findOne({
      where: { id: academico.id_alumno_personal },
    });

    if (!personal) return `Sin datos personales (id_academico: ${idAlumnoAcademico})`;

    return `${personal.nombre} ${personal.apellido_paterno}`;
  }
}