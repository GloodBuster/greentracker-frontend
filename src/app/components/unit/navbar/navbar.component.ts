import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { NotificationsListComponent } from '../../admin/notifications-list/notifications-list.component';
import { UnitsService } from '../../../services/units/units.service';
import { Activity, Activity2 } from '../../../interfaces/activities/activities';
import { ToastrService } from 'ngx-toastr';
import { UnitNotificationsComponent } from '../unit-notifications/unit-notifications.component';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ImageModule, ButtonModule, OverlayPanelModule, UnitNotificationsComponent, ProgressSpinnerModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  notifications: Activity2[] = [];
  toastService = inject(ToastrService);
  isLoading = true;

  constructor(private readonly unitsService: UnitsService) {
    this.unitsService.getNotifications().subscribe({
      next: (response) => {
        this.notifications = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        this.toastService.error('Ha ocurrido un error al cargar las notificaciones');
        this.isLoading = false;
  }
});
  }
}
