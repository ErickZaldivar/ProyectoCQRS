import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OrganizacionesService, Organizacion, CrearOrganizacionDto } from '../../Service/organizaciones.service';
import { ProgramasService, Programa, CrearProgramaDto } from '../../Service/programas.service';
import { TiposProgramasService, TipoPrograma } from '../../Service/tipos_programas.service';

interface DocumentoAlumno {
  id: number;
  id_alumno_academico: number;
  id_plan_trabajo: number;
  carta_presentacion?: string | null;
  carta_compromiso?: string | null;
  carta_aceptacion?: string | null;
  seguro_facultativo?: string | null;
}

@Component({
  selector: 'app-panel-super-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './panel-super-admin.html',
  styleUrl: './panel-super-admin.css'
})
export class PanelSuperAdminComponent implements OnInit {

  readonly apiUrl = 'http://localhost:3000';

  private readonly ADMIN_NO_CONTROL = '21041305';
  private readonly ADMIN_NIP = '1234';
  private readonly VISTA_USUARIO = 'a';
  private readonly VISTA_PASSWORD = '1';

  // ── Login ──────────────────────────────────────────────────────────────────
  sesionIniciada = false;
  loginError = '';
  credenciales = { usuario: '', password: '' };
  token = '';

  // ── Navegación ────────────────────────────────────────────────────────────
  seccionActual = 'inicio';

  // ── Documentación ─────────────────────────────────────────────────────────
  documentos: DocumentoAlumno[] = [];
  cargando = false;
  errorCarga = '';

  // ── Organizaciones ────────────────────────────────────────────────────────
  organizaciones: Organizacion[] = [];
  cargandoOrganizaciones = false;
  guardandoOrganizacion = false;
  eliminandoOrganizacion: number | null = null;
  errorOrganizacion = '';
  exitoOrganizacion = '';
  nuevaOrganizacion: CrearOrganizacionDto = {
    nombre_organizacion: '',              // cambiado
    nombre_titular_organizacion: '',      // cambiado
    puesto_titular_organizaciones: ''     // cambiado
  };

  // ── Programas ─────────────────────────────────────────────────────────────
  programas: Programa[] = [];
  tiposProgramas: TipoPrograma[] = [];
  cargandoProgramas = false;
  guardandoPrograma = false;
  eliminandoPrograma: number | null = null;
  errorPrograma = '';
  exitoPrograma = '';
  planTrabajoSeleccionado: File | undefined = undefined;
  nuevoPrograma: CrearProgramaDto = {
    id_organizacion: 0,              // cambiado
    id_tipo_programa: 0,             // cambiado
    nombre_programa: '',             // cambiado
    modalidad: true,
    fecha_inicio_servicio: '',       // cambiado
    fecha_fin_servicio: '',          // cambiado
    lista_actividades: ''            // cambiado
  };

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private organizacionesService: OrganizacionesService,
    private programasService: ProgramasService,
    private tiposProgramasService: TiposProgramasService
  ) {}

  ngOnInit(): void {
    const tokenGuardado = localStorage.getItem('admin_token');
    if (tokenGuardado) {
      this.token = tokenGuardado;
      this.sesionIniciada = true;
      this.cargarTodo();
    }
    this.salir();
  }

  // ── Auth ──────────────────────────────────────────────────────────────────

  login() {
    this.loginError = '';

    if (
      this.credenciales.usuario !== this.VISTA_USUARIO ||
      this.credenciales.password !== this.VISTA_PASSWORD
    ) {
      this.loginError = 'Credenciales incorrectas. Intenta de nuevo.';
      this.cdr.detectChanges();
      return;
    }

    this.http.post<any>(`${this.apiUrl}/auth/login`, {
      no_control: this.ADMIN_NO_CONTROL,
      nip: this.ADMIN_NIP
    }).subscribe({
      next: (res) => {
        this.token = res.access_token;
        localStorage.setItem('admin_token', res.access_token);
        this.sesionIniciada = true;
        this.cargarTodo();
        this.cdr.detectChanges();
      },
      error: () => {
        this.loginError = 'Error al conectar con el servidor.';
        this.cdr.detectChanges();
      }
    });
  }

  salir() {
    localStorage.removeItem('admin_token');
    this.token = '';
    this.sesionIniciada = false;
    this.documentos = [];
    this.organizaciones = [];
    this.programas = [];
    this.credenciales = { usuario: '', password: '' };
    this.seccionActual = 'inicio';
    this.cdr.detectChanges();
  }

  // ── Navegación ────────────────────────────────────────────────────────────

  cambiarSeccion(seccion: string) {
    this.seccionActual = seccion;
    this.cdr.detectChanges();
  }

  getTituloHeader(): string {
    const titulos: Record<string, string> = {
      inicio: 'Panel de Control',
      documentacion: 'Documentación',
      organizaciones: 'Organizaciones',
      programas: 'Programas de Servicio Social'
    };
    return titulos[this.seccionActual] ?? '';
  }

  // ── Carga inicial ─────────────────────────────────────────────────────────

  cargarTodo() {
    this.cargarDocumentos();
    this.cargarOrganizaciones();
    this.cargarProgramas();
    this.cargarTiposProgramas();
  }

  // ── Documentación ─────────────────────────────────────────────────────────

  cargarDocumentos() {
    this.cargando = true;
    this.errorCarga = '';

    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });

    this.http.get<DocumentoAlumno[]>(
      `${this.apiUrl}/servicio-social/documentos-alumnos`,
      { headers }
    ).subscribe({
      next: (res) => {
        this.documentos = Array.isArray(res) ? res : [];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorCarga = 'Error al cargar los documentos.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  verDocumento(tipo: string, id: number) {
    const url = `${this.apiUrl}/servicio-social/documentos-alumnos/${tipo}/${id}`;
    window.open(url, '_blank');
  }

  documentosCompletos(doc: DocumentoAlumno): boolean {
    return !!(doc.carta_presentacion && doc.carta_compromiso &&
              doc.carta_aceptacion && doc.seguro_facultativo);
  }

  contarDocumentos(doc: DocumentoAlumno): number {
    return [
      doc.carta_presentacion,
      doc.carta_compromiso,
      doc.carta_aceptacion,
      doc.seguro_facultativo
    ].filter(Boolean).length;
  }

  contarAlumnosCompletos(): number {
    return this.documentos.filter(d => this.documentosCompletos(d)).length;
  }

  // ── Organizaciones ────────────────────────────────────────────────────────

  cargarOrganizaciones() {
    this.cargandoOrganizaciones = true;
    this.organizacionesService.obtenerTodos().subscribe({
      next: (res) => {
        this.organizaciones = res;
        this.cargandoOrganizaciones = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargandoOrganizaciones = false;
        this.cdr.detectChanges();
      }
    });
  }





  agregarOrganizacion() {
    this.errorOrganizacion = '';
    this.exitoOrganizacion = '';

    if (!this.nuevaOrganizacion.nombre_organizacion.trim()) {
      this.errorOrganizacion = 'El nombre de la organización es requerido.';
      return;
    }

    this.guardandoOrganizacion = true;

    this.organizacionesService.crear(this.nuevaOrganizacion).subscribe({
      next: (res) => {
        this.organizaciones.push(res);
        this.nuevaOrganizacion = { nombre_organizacion: '', nombre_titular_organizacion: '', puesto_titular_organizaciones: '' };
        this.exitoOrganizacion = 'Organización agregada correctamente.';
        this.guardandoOrganizacion = false;
        setTimeout(() => { this.exitoOrganizacion = ''; this.cdr.detectChanges(); }, 3000);
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorOrganizacion = 'Error al guardar la organización.';
        this.guardandoOrganizacion = false;
        this.cdr.detectChanges();
      }
    });
  }

  eliminarOrganizacion(id: number) {
    this.eliminandoOrganizacion = id;
    this.organizacionesService.eliminarPorId(id).subscribe({
      next: () => {
        this.organizaciones = this.organizaciones.filter(o => o.id !== id);
        this.eliminandoOrganizacion = null;
        this.cdr.detectChanges();
      },
      error: () => {
        this.eliminandoOrganizacion = null;
        this.cdr.detectChanges();
      }
    });
  }

  // ── Tipos de Programa ─────────────────────────────────────────────────────

  cargarTiposProgramas() {
    this.tiposProgramasService.obtenerTodos().subscribe({
      next: (res) => {
        this.tiposProgramas = res;
        this.cdr.detectChanges();
      },
      error: () => this.cdr.detectChanges()
    });
  }

  getNombreTipoPrograma(id: number): string {
    return this.tiposProgramas.find(t => t.id === id)?.nombreTipo ?? `Tipo ${id}`;
  }

  // ── Programas ─────────────────────────────────────────────────────────────

  cargarProgramas() {
    this.cargandoProgramas = true;
    this.programasService.obtenerTodos().subscribe({
      next: (res) => {
        this.programas = res;
        this.cargandoProgramas = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargandoProgramas = false;
        this.cdr.detectChanges();
      }
    });
  }

  seleccionarPlanTrabajo(event: Event) {
    const input = event.target as HTMLInputElement;
    this.planTrabajoSeleccionado = input.files?.[0];
  }

  agregarPrograma() {
    this.errorPrograma = '';
    this.exitoPrograma = '';

    if (!this.nuevoPrograma.nombre_programa.trim()) {
      this.errorPrograma = 'El nombre del programa es requerido.';
      return;
    }
    if (!this.nuevoPrograma.id_organizacion) {
      this.errorPrograma = 'Selecciona una organización.';
      return;
    }
    if (!this.nuevoPrograma.id_tipo_programa) {
      this.errorPrograma = 'Selecciona un tipo de programa.';
      return;
    }
    if (!this.nuevoPrograma.lista_actividades.trim()) {
      this.errorPrograma = 'La lista de actividades es requerida.';
      return;
    }

    this.guardandoPrograma = true;

    this.programasService.crear(this.nuevoPrograma, this.planTrabajoSeleccionado).subscribe({
      next: (res) => {
        this.programas.push(res);
        this.nuevoPrograma = {
          id_organizacion: 0,
          id_tipo_programa: 0,
          nombre_programa: '',
          modalidad: true,
          fecha_inicio_servicio: '',
          fecha_fin_servicio: '',
          lista_actividades: ''
        };
        this.planTrabajoSeleccionado = undefined;
        this.exitoPrograma = 'Programa agregado correctamente.';
        this.guardandoPrograma = false;
        setTimeout(() => { this.exitoPrograma = ''; this.cdr.detectChanges(); }, 3000);
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorPrograma = 'Error al guardar el programa.';
        this.guardandoPrograma = false;
        this.cdr.detectChanges();
      }
    });
  }

  eliminarPrograma(id: number) {
    this.eliminandoPrograma = id;
    this.programasService.eliminar(id).subscribe({
      next: () => {
        this.programas = this.programas.filter(p => p.id !== id);
        this.eliminandoPrograma = null;
        this.cdr.detectChanges();
      },
      error: () => {
        this.eliminandoPrograma = null;
        this.cdr.detectChanges();
      }
    });
  }

  verPlanTrabajo(id: number) {
    const url = `${this.apiUrl}/servicio-social/programas/id/${id}/plan-trabajo`;
    window.open(url, '_blank');
  }

  getNombreOrganizacion(id: number): string {
    return this.organizaciones.find(o => o.id === id)?.nombreOrganizacion ?? `Org. ${id}`;
  }
}