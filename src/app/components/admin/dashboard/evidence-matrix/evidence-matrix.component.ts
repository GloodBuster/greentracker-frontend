import { Component, EventEmitter, Output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { IndicatorService } from '../../../../services/indicator/indicator.service';
import { IndicatorDetails } from '../../../../interfaces/indicator/indicator';
import { CustomHttpErrorResponse } from '../../../../interfaces/responses/error';
import { ToastrService } from 'ngx-toastr';
import { UnitDetails } from '../../../../interfaces/units/units';
import { ActivitiesService } from '../../../../services/activities/activities.service';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UnitsService } from '../../../../services/units/units.service';
import { SkeletonModule } from 'primeng/skeleton';
import { Router } from '@angular/router';

@Component({
  selector: 'app-evidence-matrix',
  standalone: true,
  imports: [TableModule, CommonModule, SkeletonModule],
  templateUrl: './evidence-matrix.component.html',
  styleUrl: './evidence-matrix.component.scss',
})
export class EvidenceMatrixComponent {
  indicators: IndicatorDetails[] = [];
  units: UnitDetails[] = [];
  loading = true;
  @Output() editChargedEvidence: EventEmitter<number> = new EventEmitter();
  @Output() editLoading: EventEmitter<boolean> = new EventEmitter();
  @Output() editUnitsWithEvidencePercentage: EventEmitter<number> =
    new EventEmitter();

  constructor(
    private readonly indicatorService: IndicatorService,
    private readonly toastService: ToastrService,
    private readonly activitiesService: ActivitiesService,
    private readonly unitsService: UnitsService,
    private readonly router: Router
  ) {
    this.indicatorService.getAllIndicators().subscribe({
      next: (response) => {
        this.indicators = response.data;

        this.unitsService.getAllUnits().subscribe({
          next: (response) => {
            this.units = response.data;
            this.loading = false;
            this.editLoading.emit(false);
            const percentage =
              (this.units.reduce((acc, unit) => {
                return acc + (unit.contributedCategories.length > 0 ? 1 : 0);
              }, 0) /
                this.units.length) *
              100;
            this.editPercentageValue(percentage);
          },
          error: (error: CustomHttpErrorResponse) => {
            if (error.error.statusCode === 500) {
              this.toastService.error('Ha ocurrido un error inesperado');
            } else {
              this.toastService.error(error.error.message);
            }
          },
        });
      },
      error: (error: CustomHttpErrorResponse) => {
        if (error.error.statusCode === 500) {
          this.toastService.error('Ha ocurrido un error inesperado');
        } else {
          this.toastService.error(error.error.message);
        }
      },
    });

    this.activitiesService
      .getFilteredActivities({ itemsPerPage: 1 })
      .subscribe({
        next: (response) => {
          this.editChargedEvidenceValue(response.data.itemCount);
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

  editPercentageValue(percentage: number): void {
    this.editUnitsWithEvidencePercentage.emit(percentage);
  }

  editChargedEvidenceValue(activitiesQuantity: number): void {
    this.editChargedEvidence.emit(activitiesQuantity);
  }

  isRecommendedCategory(unit: UnitDetails, categoryName: string): boolean {
    return unit.recommendedCategories.some(
      (recommendedCategory) => recommendedCategory.categoryName === categoryName
    );
  }

  hasActivity(unitId: string, categoryName: string): boolean {
    return this.units.some(
      (unit) =>
        unit.id === unitId &&
        unit.contributedCategories.some(
          (contributedCategory) =>
            contributedCategory.categoryName === categoryName
        )
    );
  }

  navigateToActivity(unitId: string, categoryName: string): void {
    this.router.navigate(['/activities'], { queryParams: { unitId: unitId, categoryName: categoryName } });
  }
}
