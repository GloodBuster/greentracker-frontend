import { Component, Input } from '@angular/core';
import { Activity2 } from '../../../interfaces/activities/activities';
import { CommonModule } from '@angular/common';
import { ImageModule } from 'primeng/image';
import { DividerModule } from 'primeng/divider';
import { EvidenceFeedback } from '../../../interfaces/evidences/evidences';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unit-notifications',
  standalone: true,
  imports: [CommonModule, ImageModule, DividerModule],
  templateUrl: './unit-notifications.component.html',
  styleUrl: './unit-notifications.component.scss'
})
export class UnitNotificationsComponent {
  @Input() notifications!: Activity2[];

  constructor(private readonly router: Router) {}

  hasFeedbacks(notification: Activity2): boolean {
    return notification.evidences.some(evidence => evidence.feedbacks && evidence.feedbacks.length > 0);
  }
  navigateToActivity(id: string){
    this.router.navigate(['/my-activities/', id]);
  }
}
