import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from '../../Service/auth.service';
import { DocumentosService, CampoDocumento } from '../../Service/documentos_alumnos.service';

interface Programa {
  id: number;
  nombre: string;
  descripcion: string;
  horas: number;
  estado: string;
}

interface DatosAlumno {
  no_control: string;
  nombre_completo: string;
  correo_institucional: string;
  foto_perfil?: string;
  carrera?: string;
  semestre?: number;
}

interface DocumentosAlumno {
  id: number;
  id_alumno_academico: number;
  id_plan_trabajo: number;
  carta_presentacion?: string | null;
  carta_compromiso?: string | null;
  carta_aceptacion?: string | null;
  seguro_facultativo?: string | null;
}

// Mapeo entre campo de la entidad y el tipo que usa el endpoint de ver
const CAMPO_A_TIPO: Record<CampoDocumento, 'carta-presentacion' | 'carta-compromiso' | 'carta-aceptacion' | 'seguro-facultativo'> = {
  carta_presentacion: 'carta-presentacion',
  carta_compromiso:   'carta-compromiso',
  carta_aceptacion:   'carta-aceptacion',
  seguro_facultativo: 'seguro-facultativo',
};

// Etiquetas legibles para confirmaciones y alertas
const CAMPO_A_ETIQUETA: Record<CampoDocumento, string> = {
  carta_presentacion: 'Carta de Presentación',
  carta_compromiso:   'Carta de Compromiso',
  carta_aceptacion:   'Carta de Aceptación',
  seguro_facultativo: 'Seguro Facultativo',
};

@Component({
  selector: 'app-panel-alumno',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './panel-alumno.html',
  styleUrl: './panel-alumno.css'
})
export class PanelAlumno implements OnInit {

  nombreAlumno: string = '';
  matricula: string = '';
  rolActual: string = '';
  programasDisponibles: Programa[] = [];
  seccionActual: string = 'inicio';

  archivos: any = {};
  id_alumno_academico: string = '';
  id_plan_trabajo: string = '';

  documentosExistentes: DocumentosAlumno | null = null;
  cargandoDocumentos: boolean = false;

  // Control del modal de vista previa
  documentoEnVistaPrevia: SafeResourceUrl | null = null;

  // URL blob original para liberar memoria correctamente
  documentoEnVistaPreviaRaw: string | null = null;

  tituloVistaPrevia: string = '';
  cargandoVistaPrevia: boolean = false;

  // 🆕 Control de qué campo se está eliminando (para deshabilitar su botón mientras procesa)
  campoBorrandose: CampoDocumento | null = null;

  datosAlumno: DatosAlumno = {
    no_control: '',
    nombre_completo: '',
    correo_institucional: '',
    foto_perfil: '',
    carrera: '',
    semestre: 0
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private documentosService: DocumentosService,
    private changeDetectorRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const sesionActiva = localStorage.getItem('userRole');

    if (!sesionActiva || sesionActiva !== 'alumnos') {
      this.router.navigate(['/login']);
    } else {
      this.rolActual = sesionActiva;
      this.cargarDatosDelAlumno();
      this.cargarProgramasDisponibles();
    }
  }

  cargarDatosDelAlumno() {
    const matricula = localStorage.getItem('userMatricula');
    const nombre = localStorage.getItem('userName');
    const datosJSON = localStorage.getItem('userDatos');
    const idAlumno = localStorage.getItem('id_alumno_academico');

    this.nombreAlumno = nombre || 'Estudiante';
    this.matricula = matricula || 'N/A';
    this.id_alumno_academico = idAlumno || '';

    if (datosJSON) {
      try {
        const datosCompletos = JSON.parse(datosJSON);
        this.datosAlumno = {
          no_control: datosCompletos.matricula || matricula || '',
          nombre_completo: datosCompletos.nombre || nombre || 'Estudiante',
          correo_institucional: `${matricula}@itdurango.edu.mx`,
          foto_perfil: datosCompletos.foto_perfil || '',
          carrera: datosCompletos.carrera || 'Carrera',
          semestre: datosCompletos.semestre || 0
        };
      } catch {
        this.datosAlumno = {
          no_control: matricula || '',
          nombre_completo: nombre || 'Estudiante',
          correo_institucional: `${matricula}@itdurango.edu.mx`,
          foto_perfil: '',
          carrera: 'Carrera',
          semestre: 0
        };
      }
    }

    if (this.id_alumno_academico) {
      this.cargarDocumentosExistentes();
    }

    this.changeDetectorRef.detectChanges();
  }

  cargarDocumentosExistentes() {
    this.cargandoDocumentos = true;

    this.documentosService.obtenerPorAlumno(this.id_alumno_academico).subscribe({
      next: (res) => {
        if (Array.isArray(res)) {
          this.documentosExistentes = res.length > 0 ? res[0] : null;
        } else {
          this.documentosExistentes = res || null;
        }

        if (this.documentosExistentes) {
          this.id_plan_trabajo = String(this.documentosExistentes.id_plan_trabajo);
        }

        this.cargandoDocumentos = false;
        this.changeDetectorRef.detectChanges();
      },
      error: () => {
        this.documentosExistentes = null;
        this.cargandoDocumentos = false;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  documentoYaCargado(campo: keyof DocumentosAlumno): boolean {
    return !!(this.documentosExistentes && this.documentosExistentes[campo]);
  }

  cargarProgramasDisponibles() {
    this.programasDisponibles = [
      {
        id: 1,
        nombre: 'Programa de Servicio Social en Salud',
        descripcion: 'Contribución a programas de salud comunitaria',
        horas: 480,
        estado: 'Disponible'
      },
      {
        id: 2,
        nombre: 'Programa de Educación',
        descripcion: 'Apoyo a programas educativos',
        horas: 480,
        estado: 'Disponible'
      }
    ];
  }

  seleccionarPrograma(programa: Programa) {
    this.id_plan_trabajo = String(programa.id);
    alert(`Plan de trabajo seleccionado: ${programa.nombre}`);
  }

  cambiarSeccion(seccion: string) {
    this.seccionActual = seccion;
    this.changeDetectorRef.detectChanges();
  }

  getTituloHeader(): string {
    const titulos: { [key: string]: string } = {
      inicio: 'INICIO',
      estatus: 'MI ESTATUS',
      programas: 'PROGRAMAS DISPONIBLES',
      inscripciones: 'MIS INSCRIPCIONES',
      documentacion: 'SUBIR DOCUMENTACIÓN',
      configuracion: 'CONFIGURACIÓN'
    };
    return titulos[this.seccionActual] || 'INICIO';
  }

  seleccionarArchivo(event: any, tipo: string) {
    const archivo = event.target.files[0];
    if (!archivo) return;

    const extensionesPermitidas = ['pdf', 'doc', 'docx'];
    const extension = archivo.name.split('.').pop()?.toLowerCase();

    const tiposMimePermitidos = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (
      !extension ||
      !extensionesPermitidas.includes(extension) ||
      !tiposMimePermitidos.includes(archivo.type)
    ) {
      alert('Solo se permiten archivos PDF, DOC o DOCX');
      return;
    }

    this.archivos[tipo] = archivo;
  }

  formularioValido(): boolean {
    if (!this.id_alumno_academico) return false;
    if (!this.id_plan_trabajo || Number(this.id_plan_trabajo) <= 0) return false;
    return true;
  }

  subir() {
    if (!this.formularioValido()) {
      alert('Por favor ingresa el ID del programa antes de continuar.');
      return;
    }

    const archivosSeleccionados = Object.keys(this.archivos).filter(k => this.archivos[k]);
    if (archivosSeleccionados.length === 0) {
      alert('Selecciona al menos un documento para subir.');
      return;
    }

    const formData = new FormData();
    formData.append('id_alumno_academico', this.id_alumno_academico);
    formData.append('id_plan_trabajo', this.id_plan_trabajo);

    Object.keys(this.archivos).forEach(key => {
      if (this.archivos[key]) {
        formData.append(key, this.archivos[key]);
      }
    });

    const tieneRegistro = this.documentosExistentes?.id;

    const peticion = tieneRegistro
      ? this.documentosService.actualizarDocumentos(tieneRegistro, formData)
      : this.documentosService.subirDocumentos(formData);

    peticion.subscribe({
      next: () => {
        alert('Documentos enviados correctamente');
        this.archivos = {};
        this.cargarDocumentosExistentes();
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.message || 'Error al enviar documentos');
      }
    });
  }

  // Ver documento en modal
  verDocumento(campo: CampoDocumento, titulo: string) {
    if (!this.documentosExistentes?.id) return;

    this.cargandoVistaPrevia = true;
    this.tituloVistaPrevia = titulo;
    this.documentoEnVistaPrevia = null;
    this.documentoEnVistaPreviaRaw = null;

    this.changeDetectorRef.detectChanges();

    const tipo = CAMPO_A_TIPO[campo];

    this.documentosService.verDocumento(tipo, this.documentosExistentes.id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);

        this.documentoEnVistaPreviaRaw = url;

        this.documentoEnVistaPrevia =
          this.sanitizer.bypassSecurityTrustResourceUrl(url);

        this.cargandoVistaPrevia = false;
        this.changeDetectorRef.detectChanges();
      },
      error: () => {
        this.cargandoVistaPrevia = false;
        alert('No se pudo cargar el documento.');
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  // Cerrar modal y liberar URL blob de memoria
  cerrarVistaPrevia() {
    if (this.documentoEnVistaPreviaRaw) {
      URL.revokeObjectURL(this.documentoEnVistaPreviaRaw);
    }

    this.documentoEnVistaPrevia = null;
    this.documentoEnVistaPreviaRaw = null;
    this.tituloVistaPrevia = '';

    this.changeDetectorRef.detectChanges();
  }

  // 🆕 Eliminar un documento individual (granular)
  eliminarCampoDocumento(campo: CampoDocumento) {
    if (!this.documentosExistentes?.id) return;

    const etiqueta = CAMPO_A_ETIQUETA[campo];
    const confirmar = confirm(`¿Estás seguro de que deseas eliminar la ${etiqueta}? Esta acción no se puede deshacer.`);
    if (!confirmar) return;

    // Bloquea el botón del campo que se está procesando
    this.campoBorrandose = campo;
    this.changeDetectorRef.detectChanges();

    this.documentosService.limpiarCampoDocumento(this.documentosExistentes.id, campo).subscribe({
      next: () => {
        // Actualiza el estado local sin hacer un nuevo fetch
        if (this.documentosExistentes) {
          this.documentosExistentes = {
            ...this.documentosExistentes,
            [campo]: null
          };
        }
        this.campoBorrandose = null;
        alert(`${etiqueta} eliminada correctamente.`);
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.campoBorrandose = null;
        alert(err.error?.message || `Error al eliminar la ${etiqueta}.`);
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  salir() {
    this.authService.logout();
  }
}