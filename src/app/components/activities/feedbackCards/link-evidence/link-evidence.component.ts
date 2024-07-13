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

  constructor(private readonly route: ActivatedRoute, private readonly activitiesService: ActivitiesService) {
  }

  ngOnInit() {
    if (this.evidence && this.evidence.feedbacks.length > 0) {
    this.selectedFeedback = this.evidence.feedbacks[this.evidence.feedbacks.length - 1].feedback;
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
}
