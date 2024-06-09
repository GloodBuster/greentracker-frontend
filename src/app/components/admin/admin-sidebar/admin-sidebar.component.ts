import { Component } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { DividerModule } from 'primeng/divider';
import { routes } from '../../../routes';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [ImageModule, DividerModule, RouterModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.scss',
})
export class AdminSidebarComponent {
  adminHomePage = routes.adminHomePage;
  report = routes.report;
  statistics = routes.statistics;
  chargePeriod = routes.chargePeriod;
  units = routes.units;
  indicators = routes.indicators;
  criteria = routes.criteria;
  categories = routes.categories;
}
