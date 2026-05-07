import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importante para usar *ngIf

@Component({
  selector: 'app-servicio-social',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './servicio-social.html',
  styleUrl: './servicio-social.css'
})
export class ServicioSocial implements OnInit {
  
  rolUsuario: string = ''; 

  constructor() { }

  ngOnInit(): void {
    this.rolUsuario = 'Alumno'; 
    
    console.log('Componente de Servicio Social iniciado. Rol:', this.rolUsuario);
  }
}