import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl = 'http://localhost:3000/auth';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(no_control: string, nip: string) {
    return this.http.post<any>(`${this.baseUrl}/login`, { no_control, nip }).pipe(
      tap(response => {
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        localStorage.setItem('no_control', no_control);
        localStorage.setItem('id_alumno_academico', response.id_alumno_academico.toString());
        localStorage.setItem('datos_alumno', JSON.stringify(response.attributes));
      })
    );
  }

  logout() {
    const token = this.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    // Primero revoca el token en el backend, luego limpia local
    this.http.post(`${this.baseUrl}/logout`, {}, { headers }).subscribe({
      complete: () => this.limpiarSesion(),
      error: () => this.limpiarSesion(), // limpia aunque falle el backend
    });
  }

  private limpiarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('no_control');
    localStorage.removeItem('id_alumno_academico');
    localStorage.removeItem('datos_alumno');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getIdAlumno(): string | null {
    return localStorage.getItem('id_alumno_academico');
  }

  getDatosAlumno() {
    const datos = localStorage.getItem('datos_alumno');
    return datos ? JSON.parse(datos) : null;
  }
}