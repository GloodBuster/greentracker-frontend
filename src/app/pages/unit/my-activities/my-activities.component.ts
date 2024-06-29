import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Activity } from '../../../interfaces/activities/activities';
import { ActivitiesService } from '../../../services/activities/activities.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-activities',
  standalone: true,
  imports: [CardModule, CommonModule],
  templateUrl: './my-activities.component.html',
  styleUrl: './my-activities.component.scss'
})
export class MyActivitiesComponent {
  activities: Activity[] = [];
  toastService = inject(ToastrService);

  constructor(
    private readonly activitiesService: ActivitiesService,
    private readonly router: Router
  ) {
    this.activitiesService.getMyActivities().subscribe({
      next: (response) => {
        this.activities = response.data.items;
      },
      error: (error) => {
        this.toastService.error('Ha ocurrido un error al cargar las actividades');
      }
    });
  }
  navigateToTheActivity(activityId: string): void {
    this.router.navigate(['/activity'], { queryParams: { activityId: activityId,} });
  }
}
