import { Component, inject } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { DividerModule } from 'primeng/divider';
import { routes } from '../../../routes';
import { Router, RouterModule } from '@angular/router';
import { ChangePeriodComponent } from '../change-period/change-period.component';
import { GenerateReportComponent } from '../generate-report/generate-report.component';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [
    ImageModule,
    DividerModule,
    RouterModule,
    ChangePeriodComponent,
    GenerateReportComponent,
  ],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.scss',
})
export class AdminSidebarComponent {
  visiblePeriodModal = false;
  visibleReportModal = false;
  router = inject(Router);

  showChargePeriod() {
    this.visiblePeriodModal = true;
  }

  hideChargePeriod() {
    this.visiblePeriodModal = false;
  }

  showReport() {
    this.visibleReportModal = true;
  }

  hideReport() {
    this.visibleReportModal = false;
  }

  signOut() {
    localStorage.removeItem('token');
    this.router.navigate([routes.login]);
  }

  adminHomePage = routes.adminHomePage;
  report = routes.report;
  statistics = routes.statistics;
  units = routes.units;
  indicators = routes.indicators;
  criteria = routes.criteria;
  categories = routes.categories;
}
