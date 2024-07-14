import { Component, Input, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DividerModule } from 'primeng/divider';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ActivitiesService } from '../../../../services/activities/activities.service';

@Component({
  selector: 'app-document-evidence',
  standalone: true,
  imports: [DividerModule, TagModule, InputGroupModule, InputGroupAddonModule, InputTextModule, TooltipModule, CommonModule ],
  templateUrl: './document-evidence.component.html',
  styleUrl: './document-evidence.component.scss'
})
export class DocumentEvidenceComponent {
  @Input() evidence: any;
  selectedFeedback = '';
  toastService = inject(ToastrService);
  fileSize: number = 0;
  activityId: string | undefined = undefined;

  constructor(private http: HttpClient, private readonly route: ActivatedRoute, private readonly activitiesService: ActivitiesService) {
   }

  ngOnInit() {
    this.getFileSize(this.evidence.link);
    if (this.evidence && this.evidence.feedbacks.length > 0) {
    this.selectedFeedback = this.evidence.feedbacks[this.evidence.feedbacks.length - 1].feedback;
  }

    this.route.queryParams.subscribe((params) => {
      this.activityId = params['activityId'];
    });

  }

  getFileSize(url: string) {
    this.http.head(url, { observe: 'response' }).subscribe(response => {
      this.fileSize = Number(response.headers.get('Content-Length'));
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
    this.selectedFeedback = icon;
    if (this.activityId && this.selectedFeedback !== '') {
      this.activitiesService.createEvidenceFeedback(this.activityId, this.evidence.evidenceNumber, this.selectedFeedback).subscribe({
        next: (response) => {
          this.toastService.success('Feedback enviado');
        },
        error: (error) => {
          this.toastService.error('Ha ocurrido un error inesperado');
        }
      });
    }
  }

  openFile() {
    window.open(this.evidence.link, '_blank');
  }
}
