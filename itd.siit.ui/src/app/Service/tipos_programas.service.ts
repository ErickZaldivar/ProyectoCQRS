import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface TipoPrograma {
  id: number;
  nombreTipo: string;
}

@Injectable({
  providedIn: 'root'
})
export class TiposProgramasService {

  apiUrl = 'http://localhost:3000/servicio-social/tipos-programas';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('admin_token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  obtenerTodos() {
    return this.http.get<TipoPrograma[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  obtenerPorId(id: number) {
    return this.http.get<TipoPrograma>(`${this.apiUrl}/id/${id}`, { headers: this.getHeaders() });
  }

  obtenerPorNombre(nombreTipo: string) {
    return this.http.get<TipoPrograma[]>(`${this.apiUrl}/nombre/${nombreTipo}`, { headers: this.getHeaders() });
  }
}