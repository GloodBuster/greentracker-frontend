import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CriteriaService } from '../../../services/criteria/criteria.service';
import {
  Criterion,
  CriterionForm,
  initialCriterionForm,
} from '../../../interfaces/criteria/criteria';
import { CustomHttpErrorResponse } from '../../../interfaces/responses/error';
import { ToastrService } from 'ngx-toastr';
import { TableModule } from 'primeng/table';
import { DialogCreateComponent } from '../../../components/criteria/dialog-create/dialog-create.component';
import { DialogEditComponent } from '../../../components/criteria/dialog-edit/dialog-edit.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginatorModule } from 'primeng/paginator';
import { Indicator } from '../../../interfaces/indicator/indicator';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';

interface PageEvent {
  first?: number;
  rows?: number;
  page?: number;
  pageCount?: number;
}

interface DropdownIndicatorChangeEvent extends DropdownChangeEvent {
  value: Indicator;
}

@Component({
  selector: 'app-criteria',
  standalone: true,
  imports: [
    ButtonModule,
    TableModule,
    DialogCreateComponent,
    DialogEditComponent,
    PaginatorModule,
    DropdownModule,
    TooltipModule
  ],
  templateUrl: './criteria.component.html',
  styleUrl: './criteria.component.scss',
})
export class CriteriaComponent {
  criteria: Criterion[] = [];
  indicators: Indicator[] = [];
  toastService = inject(ToastrService);
  visibleEdit = false;
  visibleCreate = false;
  criterionToEdit: CriterionForm = initialCriterionForm;
  indicatorIndex = 0;
  selectedIndicator: Indicator | undefined;
  totalRecords = 0;
  paginationRows = 10;
  first = 0;

  constructor(
    private readonly criteriaService: CriteriaService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    this.route.queryParams.subscribe((params) => {
      const page = +params['page'] || 1;
      this.first = (page - 1) * this.paginationRows;
      this.indicatorIndex = +params['index'];

      this.criteriaService.getAllIndicators().subscribe({
        next: (response) => {
          this.indicators = response.data;
          this.selectedIndicator = this.indicators.find(
            (indicator) => indicator.index === this.indicatorIndex
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

      if (!this.indicatorIndex) return;

      this.criteriaService
        .getCriteriaByIndex(this.indicatorIndex, page)
        .subscribe({
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
        });
    });
  }

  editCriterion({
    criterion,
    subindex,
  }: {
    criterion: CriterionForm;
    subindex: number;
  }) {
    const indexToUpdate = this.criteria.findIndex(
      (criterion) => criterion.subindex === subindex
    );
    this.criteria[indexToUpdate] = {
      indicatorIndex: this.indicatorIndex,
      ...criterion,
    };
  }

  deleteCriterion({ subindex }: { subindex: number }) {
    const index = this.criteria.findIndex(
      (criterion) => criterion.subindex === subindex
    );
    this.criteria.splice(index, 1);
  }

  addNewCriterion(criterion: CriterionForm) {
    this.criteria.push({ indicatorIndex: this.indicatorIndex, ...criterion });
  }

  showEdit(criterion: Criterion) {
    this.criterionToEdit = criterion;
    this.visibleEdit = true;
  }

  hideEdit() {
    this.visibleEdit = false;
    this.criterionToEdit = initialCriterionForm;
  }

  showCreate() {
    this.visibleCreate = true;
  }

  hideCreate() {
    this.visibleCreate = false;
  }

  onPageChange(event: PageEvent) {
    this.criteriaService
      .getCriteriaByIndex(this.indicatorIndex, event.page ? event.page + 1 : 1)
      .subscribe({
        next: (response) => {
          this.criteria = response.data.items;
          this.totalRecords = response.data.itemCount;
          if (event.rows) this.paginationRows = event.rows;
          if (event.first) this.first = event.first;

          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page: event.page ? event.page + 1 : 1 },
            queryParamsHandling: 'merge',
          });
        },
        error: (error: CustomHttpErrorResponse) => {
          const errorResponse = error.error;
          if (errorResponse.statusCode === 401) {
            this.toastService.error('Acceso denegado');
          } else {
            this.toastService.error('Ha ocurrido un error inesperado');
          }
        },
      });
  }

  onIndicatorChange(event: DropdownIndicatorChangeEvent) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { index: event.value.index },
      queryParamsHandling: 'merge',
    });
    this.selectedIndicator = event.value;
    this.indicatorIndex = event.value.index;

    this.criteriaService.getCriteriaByIndex(this.indicatorIndex).subscribe({
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
    });
  }
}
