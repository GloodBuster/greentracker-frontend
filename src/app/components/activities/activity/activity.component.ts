"use client"
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ActivitiesService } from '../../../services/activities/activities.service';
import { ToastrService } from 'ngx-toastr';
import { Activity } from '../../../interfaces/activities/activities';
import { TagModule } from 'primeng/tag';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { ImageEvidenceComponent } from '../feedbackCards/image-evidence/image-evidence.component';
import { LinkEvidenceComponent } from '../feedbackCards/link-evidence/link-evidence.component';
import { DocumentEvidenceComponent } from '../feedbackCards/document-evidence/document-evidence.component';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [CardModule, CommonModule, ButtonModule, TagModule, InputGroupModule, InputGroupAddonModule, InputTextModule, DividerModule, ImageEvidenceComponent, LinkEvidenceComponent, DocumentEvidenceComponent, SkeletonModule],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.scss'
})
export class ActivityComponent {
  activityId: string | undefined = undefined;
  toastService = inject(ToastrService);
  activity: Activity = {} as Activity;
  loadingItems = true;
  evidenceItems: any[] = [];


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
        this.loadingItems = false;

        this.evidenceItems = this.activity.evidences.map(evidence => {
          return evidence;
        });
      },
      error: (error) => {
        this.toastService.error('Ha ocurrido un error inesperado');
        this.loadingItems = false;
      }
    });
  }
  

}}
