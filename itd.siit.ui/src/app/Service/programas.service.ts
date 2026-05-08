import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Programa {
  id: number;
  idOrganizacion: number;                    // camelCase
  nombreOrganizacion: string;                // camelCase
  idTipoPrograma: number;                    // camelCase
  nombreTipo: string;                        // camelCase
  nombrePrograma: string;                    // camelCase
  listaActividades: string;                  // camelCase
  modalidad?: boolean;
  esModalidadInterna?: boolean;              // camelCase
  fechaInicioServicio?: Date | string | null;  // camelCase
  fechaFinServicio?: Date | string | null;     // camelCase
  planTrabajo?: string | null;               // camelCase
}

export interface CrearProgramaDto {
  id_organizacion: number;           // snake_case para enviar al backend
  id_tipo_programa: number;          // snake_case para enviar al backend
  nombre_programa: string;           // snake_case para enviar al backend
  modalidad?: boolean;
  fecha_inicio_servicio?: string;    // snake_case para enviar al backend
  fecha_fin_servicio?: string;       // snake_case para enviar al backend
  lista_actividades: string;         // snake_case para enviar al backend
}

export interface ActualizarProgramaDto {
  id_organizacion?: number;          // snake_case para enviar al backend
  id_tipo_programa?: number;         // snake_case para enviar al backend
  nombre_programa?: string;          // snake_case para enviar al backend
  modalidad?: boolean;
  fecha_inicio_servicio?: string;    // snake_case para enviar al backend
  fecha_fin_servicio?: string;       // snake_case para enviar al backend
  lista_actividades?: string;        // snake_case para enviar al backend
}

@Injectable({
  providedIn: 'root'
})
export class ProgramasService {

  apiUrl = 'http://localhost:3000/servicio-social/programas';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('admin_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  obtenerTodos() {
    return this.http.get<Programa[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  obtenerVigentes() {
    return this.http.get<Programa[]>(`${this.apiUrl}/vigentes`, {
      headers: this.getHeaders()
    });
  }

  obtenerPorId(id: number) {
    return this.http.get<Programa>(`${this.apiUrl}/id/${id}`, {
      headers: this.getHeaders()
    });
  }

  obtenerPorNombre(nombrePrograma: string) {
    return this.http.get<Programa[]>(`${this.apiUrl}/nombre/${nombrePrograma}`, {
      headers: this.getHeaders()
    });
  }

  obtenerPorOrganizacion(idOrganizacion: number) {
    return this.http.get<Programa[]>(`${this.apiUrl}/organizacion/${idOrganizacion}`, {
      headers: this.getHeaders()
    });
  }

  obtenerPorTipoPrograma(idTipoPrograma: number) {
    return this.http.get<Programa[]>(`${this.apiUrl}/tipo/${idTipoPrograma}`, {
      headers: this.getHeaders()
    });
  }

  obtenerPorModalidad(modalidad: boolean) {
    return this.http.get<Programa[]>(`${this.apiUrl}/modalidad/${modalidad}`, {
      headers: this.getHeaders()
    });
  }

  crear(dto: CrearProgramaDto, planTrabajo?: File) {
    const formData = new FormData();

    // ✅ snake_case para el backend
    formData.append('id_organizacion', dto.id_organizacion.toString());
    formData.append('id_tipo_programa', dto.id_tipo_programa.toString());
    formData.append('nombre_programa', dto.nombre_programa);
    formData.append('lista_actividades', dto.lista_actividades);

    if (dto.modalidad !== undefined) {
      formData.append('modalidad', dto.modalidad.toString());
    }

    if (dto.fecha_inicio_servicio) {
      formData.append('fecha_inicio_servicio', dto.fecha_inicio_servicio);
    }

    if (dto.fecha_fin_servicio) {
      formData.append('fecha_fin_servicio', dto.fecha_fin_servicio);
    }

    if (planTrabajo) {
      formData.append('plan_trabajo', planTrabajo);
    }

    return this.http.post<Programa>(this.apiUrl, formData, {
      headers: this.getHeaders()
    });
  }

  actualizar(id: number, dto: ActualizarProgramaDto, planTrabajo?: File) {
    const formData = new FormData();

    // ✅ snake_case para el backend
    if (dto.id_organizacion !== undefined) {
      formData.append('id_organizacion', dto.id_organizacion.toString());
    }

    if (dto.id_tipo_programa !== undefined) {
      formData.append('id_tipo_programa', dto.id_tipo_programa.toString());
    }

    if (dto.nombre_programa) {
      formData.append('nombre_programa', dto.nombre_programa);
    }

    if (dto.lista_actividades) {
      formData.append('lista_actividades', dto.lista_actividades);
    }

    if (dto.modalidad !== undefined) {
      formData.append('modalidad', dto.modalidad.toString());
    }

    if (dto.fecha_inicio_servicio) {
      formData.append('fecha_inicio_servicio', dto.fecha_inicio_servicio);
    }

    if (dto.fecha_fin_servicio) {
      formData.append('fecha_fin_servicio', dto.fecha_fin_servicio);
    }

    if (planTrabajo) {
      formData.append('plan_trabajo', planTrabajo);
    }

    return this.http.put<Programa>(`${this.apiUrl}/id/${id}`, formData, {
      headers: this.getHeaders()
    });
  }

  eliminar(id: number) {
    return this.http.delete<{
      statusCode: number;
      message: string;
    }>(`${this.apiUrl}/id/${id}`, {
      headers: this.getHeaders()
    });
  }
}