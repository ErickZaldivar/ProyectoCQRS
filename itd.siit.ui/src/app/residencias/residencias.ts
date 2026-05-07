import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-residencias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './residencias.html',
  styleUrl: './residencias.css'
})
export class Residencias implements OnInit {
  rolActual: string = '';
  nombreUsuario: string = 'Usuario Registrado';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Revisamos la sesión (localStorage) como en tu dibujo
    const sesion = localStorage.getItem('userRole');
    
    if (!sesion) {
      // Si no hay nada, directo al login
      this.router.navigate(['/login']);
    } else {
      this.rolActual = sesion;
      console.log('Acceso concedido a Residencias como:', this.rolActual);
    }
  }

  salir() {
    localStorage.removeItem('userRole');
    this.router.navigate(['/login']);
  }
}