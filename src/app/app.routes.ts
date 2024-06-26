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
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { UnidadComponent } from './pages/admin/unidad/unidad.component';
import { ActivitiesComponent } from './pages/activities/activities.component';
import { ActivityComponent } from './components/activities/activity/activity.component';
import { DashboardComponent as UnitDashboard } from './pages/unit/dashboard/dashboard.component';
import { UnitLayoutComponent } from './components/unit/unit-layout/unit-layout.component';
import { ActivityDetailsComponent } from './pages/unit/activity-details/activity-details.component';

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
        path: 'admin-dashboard',
        component: DashboardComponent,
      },
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
        path: 'category',
        component: CategoriesComponent,
      },
      {
        path: 'activities',
        component: ActivitiesComponent,
      },
      {
        path: 'activity',
        component: ActivityComponent,
      },
    ],
  },
  {
    path: '',
    component: UnitLayoutComponent,
    canActivate: [hasRoleGuard],
    data: {
      role: Role.UNIT,
    },
    children: [
      {
        path: 'unit-dashboard',
        component: UnitDashboard,
      },
      {
        path: 'my-activities/:activityId',
        component: ActivityDetailsComponent,
      },
    ],
  },
  {
    path: '**',
    pathMatch: 'full',
    component: NotFoundComponent,
  },
];
