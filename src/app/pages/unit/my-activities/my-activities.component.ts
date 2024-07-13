import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Activity } from '../../../interfaces/activities/activities';
import { ActivitiesService } from '../../../services/activities/activities.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { routes } from '../../../routes';
import { AuthService } from '../../../services/auth/auth.service';
import { CustomHttpErrorResponse } from '../../../interfaces/responses/error';

@Component({
  selector: 'app-my-activities',
  standalone: true,
  imports: [CardModule, CommonModule, SkeletonModule],
  templateUrl: './my-activities.component.html',
  styleUrl: './my-activities.component.scss',
})
export class MyActivitiesComponent {
  activities: Activity[] = [];
  toastService = inject(ToastrService);
  loadingItems = true;

  constructor(
    private readonly activitiesService: ActivitiesService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.authService.getMe().subscribe({
      next: (response) => {
        this.activitiesService
          .getFilteredActivities({ unitId: response.data.id, itemsPerPage: 10000 })
          .subscribe({
            next: (response) => {
              this.loadingItems = false;
              this.activities = response.data.items;
            },
            error: (error: CustomHttpErrorResponse) => {
              this.loadingItems = false;
              if (error.error.statusCode === 500) {
                this.toastService.error(
                  'Ha ocurrido un error al cargar las actividades'
                );
              } else {
                this.toastService.error(error.error.message);
              }
            },
          });
      },
      error: (error: CustomHttpErrorResponse) => {},
    });
  }
  navigateToTheActivity(activityId: string): void {
    this.router.navigate([routes.unitActivity + activityId]);
  }
  navigateToNewActivity(): void {
    this.router.navigate([routes.unitNewActivity]);
  }
}
