"use client"
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ActivitiesService } from '../../../services/activities/activities.service';
import { ToastrService } from 'ngx-toastr';
import { Activity } from '../../../interfaces/activities/activities';

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [CardModule, CommonModule, ButtonModule],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.scss'
})
export class ActivityComponent {
  activityId: string | undefined = undefined;
  toastService = inject(ToastrService);
  activity: Activity = {} as Activity;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly activitiesService: ActivitiesService,
  ) {
    this.route.queryParams.subscribe((params) => {
      this.activityId = params['activityId'];
    });

    if (this.activityId) {
    this.activitiesService.getActivityById(this.activityId).subscribe({
      next: (response) => {
        this.activity = response.data;
      },
      error: (error) => {
        this.toastService.error('Ha ocurrido un error inesperado');
      }
    });
  }

}}
