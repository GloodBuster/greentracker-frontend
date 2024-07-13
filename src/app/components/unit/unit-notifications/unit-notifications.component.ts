import { Component, Input } from '@angular/core';
import { Activity, Activity2 } from '../../../interfaces/activities/activities';
import { CommonModule } from '@angular/common';
import { ImageModule } from 'primeng/image';
import { DividerModule } from 'primeng/divider';
import { Evidence, EvidenceFeedback } from '../../../interfaces/evidences/evidences';
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
  isLastFeedbackApproved(notification: { evidences: EvidenceFeedback[] }): boolean {
    const lastEvidence = notification.evidences[notification.evidences.length - 1];
    const lastFeedback = lastEvidence.feedbacks[lastEvidence.feedbacks.length - 1];
    return lastFeedback.feedback === 'approved';
  }
  isLastFeedbackBrokenFile(notification: { evidences: EvidenceFeedback[] }): boolean {
    const lastEvidence = notification.evidences[notification.evidences.length - 1];
    const lastFeedback = lastEvidence.feedbacks[lastEvidence.feedbacks.length - 1];
    return lastFeedback.feedback === 'broken_file';
  }
  isLastFeedbackBrokenLink(notification: { evidences: EvidenceFeedback[] }): boolean {
    const lastEvidence = notification.evidences[notification.evidences.length - 1];
    const lastFeedback = lastEvidence.feedbacks[lastEvidence.feedbacks.length - 1];
    return lastFeedback.feedback === 'broken_link';
  }
  isLastFeedbackContactAdmin(notification: { evidences: EvidenceFeedback[] }): boolean {
    const lastEvidence = notification.evidences[notification.evidences.length - 1];
    const lastFeedback = lastEvidence.feedbacks[lastEvidence.feedbacks.length - 1];
    return lastFeedback.feedback === 'contact_admin';
  }
  navigateToActivity(id: string){
    this.router.navigate(['/my-activities/', id]);
  }
}
