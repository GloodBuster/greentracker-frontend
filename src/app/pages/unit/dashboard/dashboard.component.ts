import { Component } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';
import { ChargePeriodService } from '../../../services/charge-period/charge-period.service';
import { CustomHttpErrorResponse } from '../../../interfaces/responses/error';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { convertDateFormat } from '../../../utils/date';
import { EvidenceMatrixComponent } from '../../../components/unit/dashboard/evidence-matrix/evidence-matrix.component';
import { routes } from '../../../routes';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ProgressBarModule,
    EvidenceMatrixComponent,
    SkeletonModule,
    ToastrModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  myActivitiesRoute = routes.unitActivities;
  remainingDays = 0;
  startPeriodDate = '';
  endPeriodDate = '';
  unitsWithEvidencePercentage = 0;
  chargedEvidence = 0;
  loading = true;

  constructor(
    private readonly chargePeriodService: ChargePeriodService,
    private readonly toastService: ToastrService
  ) {
    this.chargePeriodService.getChargePeriod().subscribe({
      next: (response) => {
        this.startPeriodDate = convertDateFormat(
          response.data.startTimestamp.slice(0, 10)
        );

        this.endPeriodDate = convertDateFormat(
          response.data.endTimestamp.slice(0, 10)
        );
        const end = new Date(response.data.endTimestamp);
        const today = new Date();
        const diff = end.getTime() - today.getTime();
        this.remainingDays =
          diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
      },
      error: (error: CustomHttpErrorResponse) => {
        if (error.error.statusCode === 500) {
          this.toastService.error('Ha ocurrido un error inesperado');
        } else {
          this.toastService.error(error.error.message);
        }
      },
    });
  }

  editChargedEvidence(value: number) {
    this.chargedEvidence = value;
  }
  editUnitsWithEvidencePercentage(value: number) {
    this.unitsWithEvidencePercentage = value;
  }
  editLoading(value: boolean) {
    this.loading = value;
  }
}
