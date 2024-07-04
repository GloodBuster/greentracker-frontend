import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Activity } from '../../../interfaces/activities/activities';
import { ActivitiesService } from '../../../services/activities/activities.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { routes } from '../../../routes';

@Component({
  selector: 'app-my-activities',
  standalone: true,
  imports: [CardModule, CommonModule, SkeletonModule],
  templateUrl: './my-activities.component.html',
  styleUrl: './my-activities.component.scss'
})
export class MyActivitiesComponent {
  activities: Activity[] = [];
  toastService = inject(ToastrService);
  loadingItems = true;

  constructor(
    private readonly activitiesService: ActivitiesService,
    private readonly router: Router
  ) {
    this.activitiesService.getMyActivities().subscribe({
      next: (response) => {
        this.loadingItems = false;
        this.activities = response.data.items;
      },
      error: (error) => {
        this.loadingItems = false;
        this.toastService.error('Ha ocurrido un error al cargar las actividades');
      }
    });
  }
  navigateToTheActivity(activityId: string): void {
    this.router.navigate([routes.unitActivity + activityId]);
  }
  navigateToNewActivity(): void {
    this.router.navigate([routes.unitNewActivity]);
  }
}
