import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { hasRoleGuard } from './guards/role.guard';
import { Role } from './enums/role';
import { CriteriaComponent } from './pages/admin/criteria/criteria.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { IndicadorComponent } from './pages/admin/indicador/indicador.component';
import { CategoriesComponent } from './pages/admin/categories/categories.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { AdminLayoutComponent } from './components/admin/admin-layout/admin-layout.component';
import { UnidadComponent } from './pages/admin/unidad/unidad.component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [hasRoleGuard],
    data: {
      role: Role.UNLOGGED,
    },
    children: [
      {
        path: '',
        component: LandingPageComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
    ],
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [hasRoleGuard],
    data: {
      role: Role.ADMIN,
    },
    children: [
      {
        path: 'units',
        component: UnidadComponent,
      },
      {
        path: 'criteria',
        component: CriteriaComponent,
      },
      { 
        path: 'indicator',
        component: IndicadorComponent,
      },
      {
        path: 'category/:indicatorIndex',
        component: CategoriesComponent,
      }
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
  {
    path: '**',
    pathMatch: 'full',
    component: NotFoundComponent,
  },
];
