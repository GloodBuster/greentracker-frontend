import { Component, Input, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DividerModule } from 'primeng/divider';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ActivitiesService } from '../../../../services/activities/activities.service';

interface Feedback {
  feedback: string;
}
@Component({
  selector: 'app-link-evidence',
  standalone: true,
  imports: [DividerModule, TagModule, InputGroupModule, InputGroupAddonModule, InputTextModule, TooltipModule ],
  templateUrl: './link-evidence.component.html',
  styleUrl: './link-evidence.component.scss'
})
export class LinkEvidenceComponent {
  @Input() evidence: any;
  toastService = inject(ToastrService);
  selectedFeedback = '';
  activityId: string | undefined = undefined;
  approvedFeedback = false;
  brokenLinkFeedback = false;
  contactAdminFeedback = false;

  constructor(private readonly route: ActivatedRoute, private readonly activitiesService: ActivitiesService) {
  }

  ngOnInit() {
    if (this.evidence && this.evidence.feedbacks.length > 0) {
      this.approvedFeedback = this.evidence.feedbacks.some((feedback: Feedback) => feedback.feedback === 'approved');
      this.brokenLinkFeedback = this.evidence.feedbacks.some((feedback: Feedback) => feedback.feedback === 'broken_link');
      this.contactAdminFeedback = this.evidence.feedbacks.some((feedback: Feedback) => feedback.feedback === 'contact_admin');
    
  }

    this.route.queryParams.subscribe((params) => {
      this.activityId = params['activityId'];
    });

  }

  async copyValue(inputValue: HTMLInputElement) {
    try {
      await navigator.clipboard.writeText(inputValue.value);
      this.toastService.success('Copiado al portapapeles');
    } catch (err) {
      console.error('Error al copiar al portapapeles', err);
    }
  }
  selectFeedback(icon: string) {
    let feedbackSelected: boolean = false;
  
    switch (icon) {
      case 'approved':
        feedbackSelected = this.approvedFeedback;
        this.approvedFeedback = !this.approvedFeedback;
        break;
      case 'broken_link':
        feedbackSelected = this.brokenLinkFeedback;
        this.brokenLinkFeedback = !this.brokenLinkFeedback;
        break;
      case 'contact_admin':
        feedbackSelected = this.contactAdminFeedback;
        this.contactAdminFeedback = !this.contactAdminFeedback;
        break;
    }
  
    if (this.activityId && icon !== '') {
      if (feedbackSelected) {
        this.activitiesService.deleteEvidenceFeedback(this.activityId, this.evidence.evidenceNumber, icon).subscribe({
          next: (response) => {
            this.toastService.success('Feedback eliminado');
          },
          error: (error) => {
            this.toastService.error('Ha ocurrido un error inesperado');
          }
        });
      } else {
        this.activitiesService.createEvidenceFeedback(this.activityId, this.evidence.evidenceNumber, icon).subscribe({
          next: (response) => {
            this.toastService.success('Feedback enviado');
          },
          error: (error) => {
            this.toastService.error('Ha ocurrido un error inesperado');
          }
        });
      }
    }
  }
}
