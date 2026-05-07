import { SsDocumentosAlumnosPoco } from '../../../dtos/POCOS/servicio_social/ss_documentos_alumnos.poco';
import { CrearSsDocumentosAlumnosDto } from '../../../dtos/requests/Servicio Social/DocumentosAlumnos/crear_ss_documentos_alumnos.dto';
import { ActualizarSsDocumentosAlumnosDto } from '../../../dtos/requests/Servicio Social/DocumentosAlumnos/actualizar_ss_documentos_alumnos.dto';

export type CampoDocumento = 'carta_presentacion' | 'carta_compromiso' | 'carta_aceptacion' | 'seguro_facultativo';

export interface ISsDocumentosAlumnosRepository {
  ObtenerTodos(): Promise<SsDocumentosAlumnosPoco[]>;
  ObtenerPorId(id: number): Promise<SsDocumentosAlumnosPoco | null>;
  ObtenerPorIdAlumnoAcademico(
    id_alumno_academico: number,
  ): Promise<SsDocumentosAlumnosPoco[]>;
  ObtenerPorIdPlanTrabajo(
    id_plan_trabajo: number,
  ): Promise<SsDocumentosAlumnosPoco[]>;

  ObtenerEnPrincipalPorId(
    id: number,
  ): Promise<SsDocumentosAlumnosPoco | null>;

  ExisteEnPrincipalPorAlumno(
    id_alumno_academico: number,
  ): Promise<boolean>;

  Crear(
    dto: CrearSsDocumentosAlumnosDto,
    archivos: any,
  ): Promise<SsDocumentosAlumnosPoco>;

  Eliminar(id: number): Promise<void>;

  Actualizar(
    id: number,
    dto: ActualizarSsDocumentosAlumnosDto,
    archivos: any,
  ): Promise<SsDocumentosAlumnosPoco>;

  // 🆕 Pone un campo de archivo específico en null sin afectar los demás
  LimpiarCampo(id: number, campo: CampoDocumento): Promise<void>;
}