import { Component, inject, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
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
  imports: [
    ImageModule,
    ButtonModule,
    OverlayPanelModule,
    UnitNotificationsComponent,
    ProgressSpinnerModule,
    CommonModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  @ViewChild('adminNotificationsOverlay')
  adminNotificationsOverlay!: OverlayPanel;
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
        this.toastService.error(
          'Ha ocurrido un error al cargar las notificaciones'
        );
        this.isLoading = false;
      },
    });
  }

  haveFeedback(): boolean {
    return this.notifications.some((notification) =>
      notification.evidences.some((evidence) => evidence.feedbacks.length > 0)
    );
  }
  removeActivity(activityId: string) {
    this.notifications = this.notifications.filter((activity) => {
      return activity.id !== activityId;
    });
  }
  handleCloseOverlay(event: Event) {
    this.adminNotificationsOverlay.toggle(event);
  }
}
