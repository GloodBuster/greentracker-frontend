import { Component } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';
import { EvidenceMatrixComponent } from '../../../components/admin/dashboard/evidence-matrix/evidence-matrix.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ProgressBarModule, EvidenceMatrixComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  remainingDays = 0;
  startPeriodDate = new Date('06-01-2024').toLocaleDateString().slice(0, 10);
  endPeriodDate = new Date('06-10-2024').toLocaleDateString().slice(0, 10);
  unitsWithEvidencePercentage = 80;
  chargedEvidence = 100;

  constructor() {
    const today = new Date();
    this.remainingDays = Math.floor(
      (new Date(this.endPeriodDate).getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24)
    );
  }

  editChargedEvidence(value: number) {
    this.chargedEvidence = value;
  }
  editUnitsWithEvidencePercentage(value: number) {
    this.unitsWithEvidencePercentage = value;
  }
}
