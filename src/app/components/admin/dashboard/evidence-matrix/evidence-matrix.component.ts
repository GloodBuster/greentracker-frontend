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

interface HasActivity {
  unitId: string;
  categoryName: string;
  hasActivity: boolean;
}

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
  activitiesByUnits: HasActivity[] = [];
  loading = true;
  @Output() editChargedEvidence: EventEmitter<number> = new EventEmitter();
  @Output() editLoading: EventEmitter<boolean> = new EventEmitter();
  @Output() editUnitsWithEvidencePercentage: EventEmitter<number> =
    new EventEmitter();

  constructor(
    private readonly indicatorService: IndicatorService,
    private readonly toastService: ToastrService,
    private readonly activitiesService: ActivitiesService,
    private readonly unitsService: UnitsService
  ) {
    this.indicatorService.getAllIndicators().subscribe({
      next: (response) => {
        this.indicators = response.data;

        this.unitsService.getAllUnits().subscribe({
          next: (response) => {
            this.units = response.data;

            this.units.forEach((unit, unitIndex) => {
              this.indicators.forEach((indicator, indicatorIndex) => {
                indicator.categories.forEach((category, categoryIndex) => {
                  this.activitiesService
                    .getFilteredActivities({
                      unitId: unit.id,
                      itemsPerPage: 1,
                      categoryName: category.name,
                    })
                    .subscribe({
                      next: (response) => {
                        this.activitiesByUnits.push({
                          unitId: unit.id,
                          categoryName: category.name,
                          hasActivity: response.data.items.length > 0,
                        });

                        if (
                          unitIndex === this.units.length - 1 &&
                          indicatorIndex === this.indicators.length - 1 &&
                          categoryIndex === indicator.categories.length - 1
                        ) {
                          this.editPercentageValue(
                            this.activitiesByUnits.filter(
                              (activity) => activity.hasActivity
                            ).length / this.activitiesByUnits.length
                          );
                          this.loading = false;
                          this.editLoading.emit(false);
                        }
                      },
                      error: (error: CustomHttpErrorResponse) => {
                        if (error.error.statusCode === 500) {
                          this.toastService.error(
                            'Ha ocurrido un error inesperado'
                          );
                        } else {
                          this.toastService.error(error.error.message);
                        }
                      },
                    });
                });
              });
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
      },
      error: (error: CustomHttpErrorResponse) => {
        if (error.error.statusCode === 500) {
          this.toastService.error('Ha ocurrido un error inesperado');
        } else {
          this.toastService.error(error.error.message);
        }
      },
    });

    this.activitiesService.getFilteredActivities({}).subscribe({
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

    this.units = [
      {
        id: '1',
        name: 'Unit 1',
        email: 'unit1@example.com',
        recommendedCategories: [
          {
            indicatorIndex: 0,
            name: 'Category 1',
          },
        ],
      },
      {
        id: '2',
        name: 'Unit 2',
        email: 'unit2@example.com',
        recommendedCategories: [
          {
            indicatorIndex: 1,
            name: 'Category 2',
          },
        ],
      },
      {
        id: '3',
        name: 'Unit 3',
        email: 'unit3@example.com',
        recommendedCategories: [
          {
            indicatorIndex: 2,
            name: 'Category 3',
          },
        ],
      },
    ];
    this.indicators = [
      {
        index: 0,
        englishName: 'Test Indicator 1',
        spanishAlias: 'Indicador de Prueba 1',
        categories: [
          {
            name: 'Category 1',
            criteria: [
              {
                indicatorIndex: 0,
                subindex: 0,
                englishName: 'Test Criteria 1',
                spanishAlias: 'Criterio de Prueba 1',
              },
            ],
          },
        ],
      },
      {
        index: 1,
        englishName: 'Test Indicator 2',
        spanishAlias: 'Indicador de Prueba 2',
        categories: [
          {
            name: 'Category 2',
            criteria: [
              {
                indicatorIndex: 1,
                subindex: 1,
                englishName: 'Test Criteria 2',
                spanishAlias: 'Criterio de Prueba 2',
              },
            ],
          },
        ],
      },
      {
        index: 2,
        englishName: 'Test Indicator 3',
        spanishAlias: 'Indicador de Prueba 3',
        categories: [
          {
            name: 'Category 3',
            criteria: [
              {
                indicatorIndex: 2,
                subindex: 2,
                englishName: 'Test Criteria 3',
                spanishAlias: 'Criterio de Prueba 3',
              },
            ],
          },
        ],
      },
    ];
  }

  editPercentageValue(percentage: number): void {
    this.editUnitsWithEvidencePercentage.emit(percentage);
  }

  editChargedEvidenceValue(activitiesQuantity: number): void {
    this.editChargedEvidence.emit(activitiesQuantity);
  }

  isRecommendedCategory(unit: UnitDetails, categoryName: string): boolean {
    return unit.recommendedCategories.some(
      (recommendedCategory) => recommendedCategory.name === categoryName
    );
  }

  hasActivity(unitId: string, categoryName: string): boolean {
    return this.activitiesByUnits.some(
      (activity) =>
        activity.unitId === unitId &&
        activity.categoryName === categoryName &&
        activity.hasActivity
    );
  }
}
