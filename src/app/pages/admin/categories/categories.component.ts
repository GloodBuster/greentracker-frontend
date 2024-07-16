import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import {
  Categories,
  CategoriesByIndicator,
  CategoriesForm,
  initialCategoriesForm,
} from '../../../interfaces/categories/categories';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '../../../services/categories/categories.service';
import { CustomHttpErrorResponse } from '../../../interfaces/responses/error';
import { DialogCreateComponent } from '../../../components/category/dialog-create/dialog-create.component';
import { DialogEditComponent } from '../../../components/category/dialog-edit/dialog-edit.component';
import { Indicator } from '../../../interfaces/indicator/indicator';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { Criterion } from '../../../interfaces/criteria/criteria';
import { CriteriaService } from '../../../services/criteria/criteria.service';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';

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
  selector: 'app-categories',
  standalone: true,
  imports: [
    ButtonModule,
    TableModule,
    CommonModule,
    PaginatorModule,
    DialogCreateComponent,
    DialogEditComponent,
    DropdownModule,
    TagModule,
    TooltipModule,
    SkeletonModule
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  categories: CategoriesByIndicator[] = [];
  indicators: Indicator[] = [];
  toastService = inject(ToastrService);
  indicatorIndex = 0;
  selectedIndicator: Indicator | undefined;
  totalRecords = 0;
  paginationRows = 10;
  first = 0;
  visibleCreate = false;
  visibleEdit = false;
  categoryToEdit: any;
  criteria: Criterion[] = [];
  loadingItems = true;
  loadingIndicators = true;
  loadingCriteria = true;

  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly criteriaService: CriteriaService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.loadingItems = true;
      const page = +params['page'] || 1;
      this.first = (page - 1) * this.paginationRows;
      this.indicatorIndex = +params['index'];

      this.categoriesService.getAllIndicators().subscribe({
        next: (response) => {
          this.indicators = response.data.items;
          this.selectedIndicator = this.indicators.find(
            (indicator) => indicator.index === this.indicatorIndex
          );
          this.loadingIndicators = false;
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
          this.loadingIndicators = false;
        },
      });

      if (!this.indicatorIndex) return;

      this.categoriesService
        .getCategoriesByIndex(this.indicatorIndex, page)
        .subscribe({
          next: (response) => {
            this.categories = response.data.items;
            this.totalRecords = response.data.itemCount;
            this.paginationRows = response.data.itemsPerPage;
            this.loadingItems = false;
          },
          error: (error: CustomHttpErrorResponse) => {
            const errorResponse = error.error;
            if (errorResponse.statusCode === 401) {
              this.toastService.error('Acceso denegado');
            } else {
              this.toastService.error('Ha ocurrido un error inesperado');
            }
            this.loadingItems = false
          },
        });

      this.criteriaService
        .getCriteriaByIndex(this.indicatorIndex, 1, 9999)
        .subscribe({
          next: (response) => {
            this.loadingCriteria = false
            this.criteria = response.data.items.map((criterion) => {
              return {
                subindex: criterion.subindex,
                englishName: criterion.englishName,
                indicatorIndex: criterion.indicatorIndex,
                spanishAlias: criterion.spanishAlias
              }
            });
          },
          error: (error: CustomHttpErrorResponse) => {
            const errorResponse = error.error;
            this.loadingCriteria = false
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

  allCriteriaEmpty(index: number): boolean {
    return this.categories[index].criteria.length === 0;
  }

  showCreate() {
    this.visibleCreate = true;
  }
  hideCreate() {
    this.visibleCreate = false;
  }
  createCategory(category: any) {
    this.categories.push({ indicatorIndex: this.indicatorIndex, ...category });
  }

  showEdit(category: Categories) {
    this.categoryToEdit = category;
    this.visibleEdit = true;
  }
  hideEdit() {
    this.visibleEdit = false;
    this.categoryToEdit = initialCategoriesForm;
  }
  editCategory({
    category,
    name,
  }: {
    category: CategoriesByIndicator;
    name: string;
  }) {
    const indexToUpdate = this.categories.findIndex(
      (category) => category.name === name
    );

    this.categories[indexToUpdate] = category;
  }
  deleteCategory({ name }: { name: string }) {
    const index = this.categories.findIndex(
      (category) => category.name === name
    );
    this.categories.splice(index, 1);
  }

  onPageChange(event: PageEvent) {
    this.loadingItems = true;
    this.categoriesService
      .getCategoriesByIndex(
        this.indicatorIndex,
        event.page ? event.page + 1 : 1
      )
      .subscribe({
        next: (response) => {
          this.categories = response.data.items;
          this.totalRecords = response.data.itemCount;
          if (event.rows) this.paginationRows = event.rows;
          if (event.first) this.first = event.first;
          this.loadingItems = false

          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
              page: event.page ? event.page + 1 : 1,
            },
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
          this.loadingItems = false
        },
      });
  }

  onIndicatorChange(event: DropdownIndicatorChangeEvent) {
    this.loadingIndicators = true;
    this.loadingCriteria = true;
    this.loadingItems = true;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { index: event.value.index },
      queryParamsHandling: 'merge',
    });
    this.selectedIndicator = event.value;
    this.indicatorIndex = event.value.index;

    this.categoriesService.getCategoriesByIndex(this.indicatorIndex).subscribe({
      next: (response) => {
        this.categories = response.data.items;
        this.totalRecords = response.data.itemCount;
        this.paginationRows = response.data.itemsPerPage;
        this.loadingIndicators = false;
        this.loadingItems = false;
      },
      error: (error: CustomHttpErrorResponse) => {
        const errorResponse = error.error;
        if (errorResponse.statusCode === 401) {
          this.toastService.error('Acceso denegado');
        } else {
          this.toastService.error(
            'Ha ocurrido un error inesperado al cargar las categorías'
          );
        }
        this.loadingIndicators = false;
        this.loadingItems = false;
      },
    });

    this.criteriaService
      .getCriteriaByIndex(this.indicatorIndex, 1, 9999)
      .subscribe({
        next: (response) => {
          this.criteria = response.data.items;
          this.loadingCriteria = false;
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
          this.loadingCriteria = false;
        },
      });
  }
}
