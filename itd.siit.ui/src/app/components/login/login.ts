import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-angular';
import { AuthService } from '../../Service/auth.service';
import { finalize, timeout } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, LucideAngularModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  no_control: string = '';
  nip: string = '';
  showPassword = false;
  isLoading = false;
  errorMessage = '';

  readonly Mail = Mail;
  readonly Lock = Lock;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly Loader2 = Loader2;

  constructor(
    private router: Router,
    private auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  handleSubmit() {

    console.log("VALORES ORIGINALES:", this.no_control, this.nip);

    const no_control = this.no_control.trim();
    const nip = this.nip.trim();

    console.log("VALORES LIMPIOS:", no_control, nip);

    this.isLoading = true;
    this.errorMessage = '';

    const fallbackTimeout = window.setTimeout(() => {
      if (this.isLoading) {
        this.errorMessage = 'El servidor no respondió. Intenta de nuevo más tarde.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    }, 20000);

    this.auth.login(no_control, nip)
      .pipe(
        timeout(15000),
        finalize(() => {
          clearTimeout(fallbackTimeout);
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (res: any) => {

          console.log("✅ RESPUESTA BACK:", res);

          localStorage.setItem('token', res.access_token);
          localStorage.setItem('refresh_token', res.refresh_token);
          localStorage.setItem('userRole', res.type);

          if (res.attributes) {
            localStorage.setItem('userName', res.attributes.nombre || '');
            localStorage.setItem('userMatricula', res.attributes.matricula || '');
            localStorage.setItem('userCreditos', String(res.attributes.creditos || 0));
            localStorage.setItem('userCarrera', res.attributes.carrera || '');
            localStorage.setItem('userDatos', JSON.stringify(res.attributes));
          }

          if (res.id_alumno_academico) {
            localStorage.setItem(
              'id_alumno_academico',
              res.id_alumno_academico.toString()
            );
          }

          if (res.type === 'admin') {
            this.router.navigate(['/admin']);
          }
          else if (res.type === 'super-admin') {
            this.router.navigate(['/super-admin']);
          }
          else if (res.type === 'alumnos') {
            this.router.navigate(['/alumno']);
          }
          else {
            console.log("❌ Tipo de rol no reconocido:", res.type);
          }
        },

        error: (err) => {
          console.error("❌ ERROR BACK:", err);

          if (err.name === 'TimeoutError') {
            this.errorMessage = 'El servidor no respondió. Intenta de nuevo más tarde.';
          } else if (err.status === 401) {
            this.errorMessage = 'Credenciales incorrectas';
          } else {
            this.errorMessage = 'Error del servidor';
          }
        }
      });
  }

  onInputChange() {
    if (this.errorMessage) {
      this.errorMessage = '';
    }
  }
}