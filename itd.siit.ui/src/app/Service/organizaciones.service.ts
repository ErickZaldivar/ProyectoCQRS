import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Organizacion {
  id: number;
  nombreOrganizacion: string;
  nombreTitularOrganizacion?: string;
  puestoTitularOrganizaciones?: string;
}

export interface CrearOrganizacionDto {
  nombre_organizacion: string;              // antes: nombreOrganizacion
  nombre_titular_organizacion?: string;     // antes: nombreTitularOrganizacion
  puesto_titular_organizaciones?: string;   // antes: puestoTitularOrganizaciones
}

export interface ActualizarOrganizacionDto {
  nombreOrganizacion: string;
  nombreTitularOrganizacion?: string;
  puestoTitularOrganizaciones?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrganizacionesService {

  apiUrl = 'http://localhost:3000/servicio-social/organizaciones';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('admin_token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  obtenerTodos() {
    return this.http.get<Organizacion[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  obtenerPorId(id: number) {
    return this.http.get<Organizacion>(`${this.apiUrl}/id/${id}`, { headers: this.getHeaders() });
  }

  obtenerPorNombre(nombre: string) {
    return this.http.get<Organizacion[]>(`${this.apiUrl}/nombre/${nombre}`, { headers: this.getHeaders() });
  }

  obtenerPorNombreTitular(nombreTitular: string) {
    return this.http.get<Organizacion[]>(`${this.apiUrl}/titular/${nombreTitular}`, { headers: this.getHeaders() });
  }

  crear(dto: CrearOrganizacionDto) {
    return this.http.post<Organizacion>(this.apiUrl, dto, { headers: this.getHeaders() });
  }

  eliminarPorId(id: number) {
    return this.http.delete(`${this.apiUrl}/id/${id}`, { headers: this.getHeaders() });
  }

  eliminarPorNombre(nombre: string) {
    return this.http.delete(`${this.apiUrl}/nombre/${nombre}`, { headers: this.getHeaders() });
  }

  actualizar(id: number, dto: ActualizarOrganizacionDto) {
    return this.http.put<Organizacion>(`${this.apiUrl}/id/${id}`, dto, { headers: this.getHeaders() });
  }
}