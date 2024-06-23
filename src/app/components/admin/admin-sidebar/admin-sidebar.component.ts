import { Component } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { DividerModule } from 'primeng/divider';
import { routes } from '../../../routes';
import { RouterModule } from '@angular/router';
import { ChangePeriodComponent } from '../change-period/change-period.component';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [ImageModule, DividerModule, RouterModule, ChangePeriodComponent],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.scss',
})
export class AdminSidebarComponent {
  visiblePeriodModal = false;

  showChargePeriod() {
    this.visiblePeriodModal = true;
  }

  hideChargePeriod() {
    this.visiblePeriodModal = false;
  }

  adminHomePage = routes.adminHomePage;
  report = routes.report;
  statistics = routes.statistics;
  units = routes.units;
  indicators = routes.indicators;
  criteria = routes.criteria;
  categories = routes.categories;
}
