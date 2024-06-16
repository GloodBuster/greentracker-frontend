import { Component, inject } from '@angular/core';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { Units } from '../../interfaces/activities/activities';
import { ToastrService } from 'ngx-toastr';
import { ActivitiesService } from '../../services/activities/activities.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomHttpErrorResponse } from '../../interfaces/responses/error';
import { PaginatorModule } from 'primeng/paginator';
import { CardModule } from 'primeng/card';
import { activitiesData } from '../../components/activities/activitiesData';
import { CommonModule } from '@angular/common';

interface PageEvent {
  first?: number;
  rows?: number;
  page?: number;
  pageCount?: number;
}

interface DropdownUnitChangeEvent extends DropdownChangeEvent {
  value: Units;
}

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [
    PaginatorModule,
    DropdownModule,
    CardModule,
  CommonModule],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.scss'
})
export class ActivitiesComponent {
activities = activitiesData;
units: Units[] = [];
toastService = inject(ToastrService);
unitIndex = "";
selectedUnit: Units | undefined;
totalRecords = 0;
paginationRows = 10;
first = 0;

constructor(
  private readonly activitiesService: ActivitiesService,
  private readonly route: ActivatedRoute,
  private readonly router: Router
){
  this.route.queryParams.subscribe((params) => {
    const page = +params['page'] || 1;
    this.first = (page - 1) * this.paginationRows;
    this.activitiesService.getAllUnits().subscribe({
      next: (response) => {
        this.units = response.data.items;
        this.selectedUnit = this.units.find(
          (unit) => unit.id === this.unitIndex
        );
      },
      error: (error: CustomHttpErrorResponse) => {
        const errorResponse = error.error;
        if (errorResponse.statusCode === 401) {
          this.toastService.error('Acceso denegado');
        } else {
          this.toastService.error(
            'Ha ocurrido un error inesperado al cargar los indicadores'
          );
        }
      },
    });

    if(!this.unitIndex) return;

  }
  );
}
onUnitChange(event: DropdownUnitChangeEvent) {
  this.router.navigate([], {
    relativeTo: this.route,
    queryParams: { index: event.value.id },
    queryParamsHandling: 'merge',
  });
  this.selectedUnit = event.value;
  this.unitIndex = event.value.id;

  /*this.criteriaService.getCriteriaByIndex(this.indicatorIndex).subscribe({
    next: (response) => {
      this.criteria = response.data.items;
      this.totalRecords = response.data.itemCount;
      this.paginationRows = response.data.itemsPerPage;
    },
    error: (error: CustomHttpErrorResponse) => {
      const errorResponse = error.error;
      if (errorResponse.statusCode === 401) {
        this.toastService.error('Acceso denegado');
      } else {
        this.toastService.error(
          'Ha ocurrido un error inesperado al cargar los criterios'
        );
      }
    },
  });*/
}
}
