import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-panel-admin',
  standalone: true,
  templateUrl: './panel-admin.html'
})
export class PanelAdmin implements OnInit {
  
  nombreAdmin: string = '';
  departamento: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Revisamos la Variable Session que pusiste en tu dibujo
    const rol = localStorage.getItem('userRole'); 
    
    // Verificamos que sea Admin (o SuperAdmin, que suele tener permiso a todo)
    if (rol === 'Admin' || rol === 'SAdmin') {
      this.cargarDatosAdmin();
    } else {
      // Si es un Alumno intentando entrar aquí, o no hay sesión, al login
      this.router.navigate(['/login']); 
    }
  }

  cargarDatosAdmin() {
    this.nombreAdmin = 'Ing. Rodríguez';
    this.departamento = 'Coordinación de Servicio Social';
    console.log('Panel de Administración listo');
  }
}