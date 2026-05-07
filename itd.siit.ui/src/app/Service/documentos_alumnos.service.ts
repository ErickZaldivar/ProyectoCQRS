import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

export type CampoDocumento =
  | 'carta_presentacion'
  | 'carta_compromiso'
  | 'carta_aceptacion'
  | 'seguro_facultativo';

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {

  apiUrl = "http://localhost:3000/servicio-social/documentos-alumnos";

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  subirDocumentos(formData: FormData) {
    return this.http.post(this.apiUrl, formData, { headers: this.getHeaders() });
  }

  obtenerPorAlumno(id_alumno: string) {
    return this.http.get<any>(`${this.apiUrl}/alumno/${id_alumno}`, { headers: this.getHeaders() });
  }

  actualizarDocumentos(id_registro: number, formData: FormData) {
    return this.http.put(`${this.apiUrl}/id/${id_registro}`, formData, { headers: this.getHeaders() });
  }

  // 👁️ Ver un documento (retorna Blob para abrir en modal)
  verDocumento(
    tipo: 'carta-presentacion' | 'carta-compromiso' | 'carta-aceptacion' | 'seguro-facultativo',
    id_registro: number
  ) {
    return this.http.get(`${this.apiUrl}/ver-${tipo}/${id_registro}`, {
      headers: this.getHeaders(),
      responseType: 'blob'
    });
  }

  // 🗑️ Eliminar registro completo (mantener por si se necesita en el futuro)
  eliminarDocumentos(id_registro: number) {
    return this.http.delete(`${this.apiUrl}/id/${id_registro}`, { headers: this.getHeaders() });
  }

  // 🆕 Limpiar un campo individual sin borrar el registro completo
  limpiarCampoDocumento(id_registro: number, campo: CampoDocumento) {
    return this.http.patch(
      `${this.apiUrl}/limpiar-campo/${id_registro}`,
      { campo },
      { headers: this.getHeaders() }
    );
  }
}