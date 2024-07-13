import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { NotificationsListComponent } from '../../admin/notifications-list/notifications-list.component';
import { UnitsService } from '../../../services/units/units.service';
import { Activity } from '../../../interfaces/activities/activities';
import { ToastrService } from 'ngx-toastr';
import { UnitNotificationsComponent } from '../unit-notifications/unit-notifications.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ImageModule, ButtonModule, OverlayPanelModule, UnitNotificationsComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  notifications: Activity[] = [];
  toastService = inject(ToastrService);

  constructor(private readonly unitsService: UnitsService) {
    this.unitsService.getNotifications().subscribe({
      next: (response) => {
        this.notifications = response.data;
      },
      error: (error) => {
        this.toastService.error('Ha ocurrido un error al cargar las notificaciones');
  }
});
  }
}
