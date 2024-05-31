import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { hasRoleGuard } from './guards/role.guard';
import { Role } from './enums/role';

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
    path: '',
    canActivate: [hasRoleGuard],
    data: {
      role: Role.ADMIN,
    },
    children: [],
  },

  {
    path: '',
    canActivate: [hasRoleGuard],
    data: {
      role: Role.UNIT,
    },
    children: [],
  },
];
