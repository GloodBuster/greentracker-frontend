import { Component, inject } from '@angular/core';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { Activity, Units } from '../../interfaces/activities/activities';
import { ToastrService } from 'ngx-toastr';
import { ActivitiesService } from '../../services/activities/activities.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomHttpErrorResponse } from '../../interfaces/responses/error';
import { PaginatorModule } from 'primeng/paginator';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { UnitsService } from '../../services/units/units.service';
import { UnitDetails } from '../../interfaces/units/units';
import { SkeletonModule } from 'primeng/skeleton';

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
  imports: [PaginatorModule, DropdownModule, CardModule, CommonModule, SkeletonModule],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.scss',
})
export class ActivitiesComponent {
  activities: Activity[] = [];
  units: UnitDetails = {} as UnitDetails;
  toastService = inject(ToastrService);
  unitIndex = '';
  totalRecords = 0;
  paginationRows = 10;
  first = 0;
  unitId: string | undefined = undefined;
  categoryName: string | undefined = undefined;
  loadingName = true;
  loadingItems = true;

  constructor(
    private readonly activitiesService: ActivitiesService,
    private readonly unitService: UnitsService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    this.route.queryParams.subscribe((params) => {
      this.unitId = params['unitId'];
      this.categoryName = params['categoryName'];
    });

    this.activitiesService.getFilteredActivities({
      pageIndex: this.first,
      itemsPerPage: this.paginationRows,
      unitId: this.unitId,
      categoryName: this.categoryName,
    }).subscribe({
      next: (response) => {
        this.activities = response.data.items;
        this.totalRecords = response.data.itemCount;
        this.paginationRows = response.data.itemsPerPage;
        this.loadingItems = false;
      },
      error: (error: CustomHttpErrorResponse) => {
        if (error.error.statusCode === 500) {
          this.toastService.error('Ha ocurrido un error inesperado');
        } else {
          this.toastService.error(error.error.message);
        }
        this.loadingItems = false;
      },
    });

    if (this.unitId !== undefined) {
      this.unitService.getUnitById(this.unitId).subscribe({
        next: (response) => {
          this.units = response.data;
          this.loadingName = false;
        },
        error: (error: CustomHttpErrorResponse) => {
          if (error.error.statusCode === 500) {
            this.toastService.error('Ha ocurrido un error inesperado');
          } else {
            this.toastService.error(error.error.message);
          }
          this.loadingName = false;
        },
      });
    }
  }
  navigateToTheActivity(activityId: string): void {
    this.router.navigate(['/activity'], { queryParams: { activityId: activityId,} });
  }

}
