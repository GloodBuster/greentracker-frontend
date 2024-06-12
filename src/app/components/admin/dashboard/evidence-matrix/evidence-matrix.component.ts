import { Component, EventEmitter, Output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { IndicatorService } from '../../../../services/indicator/indicator.service';
import { IndicatorDetails } from '../../../../interfaces/indicator/indicator';
import { CustomHttpErrorResponse } from '../../../../interfaces/responses/error';
import { ToastrService } from 'ngx-toastr';
import { UnitDetails } from '../../../../interfaces/units/units';

@Component({
  selector: 'app-evidence-matrix',
  standalone: true,
  imports: [TableModule],
  templateUrl: './evidence-matrix.component.html',
  styleUrl: './evidence-matrix.component.scss',
})
export class EvidenceMatrixComponent {
  indicators: IndicatorDetails[] = [];
  units: UnitDetails[] = [];
  @Output() editChargedEvidence: EventEmitter<number> = new EventEmitter();
  @Output() editUnitsWithEvidencePercentage: EventEmitter<number> =
    new EventEmitter();

  constructor(
    private readonly indicatorService: IndicatorService,
    private readonly toastService: ToastrService
  ) {
    this.indicatorService.getAllIndicators().subscribe({
      next: (response) => {
        this.indicators = response.data;
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

  isRecommendedCategory(unit: UnitDetails, categoryName: string): boolean {
    return unit.recommendedCategories.some(
      (recommendedCategory) => recommendedCategory.name === categoryName
    );
  }
}
