import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { hasRoleGuard } from './guards/role.guard';
import { Role } from './enums/role';
import { CriteriaComponent } from './pages/admin/criteria/criteria.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [hasRoleGuard],
    data: {
      role: Role.UNLOGGED,
    },
  },
  {
    path: '',
    canActivate: [hasRoleGuard],
    data: {
      role: Role.SUPER_ADMIN,
    },
    children: [
      {
        path: 'criteria',
        component: CriteriaComponent,
      },
    ],
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
