import { Component, Input, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DividerModule } from 'primeng/divider';
import { ImageModule } from 'primeng/image';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivitiesService } from '../../../../services/activities/activities.service';
import { ActivatedRoute } from '@angular/router';

interface Feedback {
  feedback: string;
}
@Component({
  selector: 'app-image-evidence',
  standalone: true,
  imports: [DividerModule, TagModule, InputGroupModule, InputGroupAddonModule, InputTextModule, TooltipModule,ImageModule, CommonModule ],
  templateUrl: './image-evidence.component.html',
  styleUrl: './image-evidence.component.scss'
})
export class ImageEvidenceComponent {
  @Input() evidence: any;
  toastService = inject(ToastrService);
  selectedFeedback = '';
  imageSize: number = 0;
  activityId: string | undefined = undefined;
  approvedFeedback = false;
  brokenFileFeedback = false;
  brokenLinkFeedback = false;
  contactAdminFeedback = false;

  constructor(private http: HttpClient, private readonly route: ActivatedRoute, private readonly activitiesService: ActivitiesService) {}

  ngOnInit() {
    this.getImageSize(this.evidence.link);

    if (this.evidence && this.evidence.feedbacks.length > 0) {
    this.approvedFeedback = this.evidence.feedbacks.some((feedback: Feedback) => feedback.feedback === 'approved');
    this.brokenFileFeedback = this.evidence.feedbacks.some((feedback: Feedback) => feedback.feedback === 'broken_file');
    this.brokenLinkFeedback = this.evidence.feedbacks.some((feedback: Feedback) => feedback.feedback === 'broken_link');
    this.contactAdminFeedback = this.evidence.feedbacks.some((feedback: Feedback) => feedback.feedback === 'contact_admin');
  }

    this.route.queryParams.subscribe((params) => {
      this.activityId = params['activityId'];
    });
  }

  getImageSize(url: string) {
    this.http.head(url, { observe: 'response' }).subscribe(response => {
      this.imageSize = Number(response.headers.get('Content-Length'));
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
      case 'broken_file':
        feedbackSelected = this.brokenFileFeedback;
        this.brokenFileFeedback = !this.brokenFileFeedback;
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
