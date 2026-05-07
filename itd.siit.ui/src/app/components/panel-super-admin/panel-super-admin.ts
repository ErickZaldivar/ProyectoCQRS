import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  // Credenciales reales del backend (cuenta de alumno usada como admin)
  private readonly ADMIN_NO_CONTROL = '21041305';
  private readonly ADMIN_NIP = '1234';

  // Credenciales visuales del panel (lo que escribe el gerente)
  private readonly VISTA_USUARIO = 'a';
  private readonly VISTA_PASSWORD = '1';

  // LOGIN
  sesionIniciada: boolean = false;
  loginError: string = '';
  credenciales = { usuario: '', password: '' };
  token: string = '';

  // DOCUMENTOS
  documentos: DocumentoAlumno[] = [];
  cargando: boolean = false;
  errorCarga: string = '';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const tokenGuardado = localStorage.getItem('admin_token');
    if (tokenGuardado) {
      this.token = tokenGuardado;
      this.sesionIniciada = true;
      this.cargarDocumentos();
    }
  }

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
        this.cargarDocumentos();
        this.cdr.detectChanges();
      },
      error: () => {
        this.loginError = 'Error al conectar con el servidor.';
        this.cdr.detectChanges();
      }
    });
  }

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

  salir() {
    localStorage.removeItem('admin_token');
    this.token = '';
    this.sesionIniciada = false;
    this.documentos = [];
    this.credenciales = { usuario: '', password: '' };
    this.cdr.detectChanges();
  }
}