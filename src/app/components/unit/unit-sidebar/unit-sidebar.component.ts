import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { ImageModule } from 'primeng/image';
import { routes } from '../../../routes';

@Component({
  selector: 'app-unit-sidebar',
  standalone: true,
  imports: [ImageModule, DividerModule, RouterModule],
  templateUrl: './unit-sidebar.component.html',
  styleUrl: './unit-sidebar.component.scss',
})
export class UnitSidebarComponent {
  visiblePeriodModal = false;
  router = inject(Router);

  showChargePeriod() {
    this.visiblePeriodModal = true;
  }

  hideChargePeriod() {
    this.visiblePeriodModal = false;
  }

  signOut() {
    localStorage.removeItem('token');
    this.router.navigate([routes.login]);
  }

  unitHomePage = routes.unitHomePage;
  unitStatistics = routes.unitStatistics;
  unitActivities = routes.unitActivities;
}
