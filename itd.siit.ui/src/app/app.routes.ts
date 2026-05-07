import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { PanelAlumno } from './components/panel-alumno/panel-alumno';
import { PanelAdmin } from './components/panel-admin/panel-admin';
import { PanelSuperAdminComponent } from './components/panel-super-admin/panel-super-admin';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'alumno', component: PanelAlumno },
  { path: 'admin', component: PanelAdmin },
  { path: 'super-admin', component: PanelSuperAdminComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' } 
];