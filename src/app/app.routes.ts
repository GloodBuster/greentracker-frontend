import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { UnidadComponent } from './pages/admin/unidad/unidad.component';
import { IndicadorComponent } from './pages/admin/indicador/indicador.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'unidad',
    component: UnidadComponent,
  },
  {
    path: 'indicador',
    component: IndicadorComponent,

  }
];
