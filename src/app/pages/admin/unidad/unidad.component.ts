import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DialogCreateComponent } from '../../../components/unidad/dialog-create/dialog-create.component';
import { DialogEditComponent } from '../../../components/unidad/dialog-edit/dialog-edit.component';
import {
  CategoriesData,
  CategoriesForm,
  Indicators,
  UnitsGet,
} from '../../../interfaces/units/units';
import { UnitsService } from '../../../services/units/units.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomHttpErrorResponse } from '../../../interfaces/responses/error';
import { PaginatorModule } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';

interface PageEvent {
  first?: number;
  rows?: number;
  page?: number;
  pageCount?: number;
}

export function CategoriesDataToForm(
  categories: CategoriesData[],
  indicators: Indicators[]
): CategoriesForm[] {
  return categories?.map((category) => {
    const indicatorIndex = indicators.find((indicator) =>
      indicator.categories.some(
        (indicatorCategory) => category.name === indicatorCategory.name
      )
    );
    return {
      categoryName: category.name,
      indicatorIndex: indicatorIndex?.index ?? 0,
    };
  });
}
export function FormToCategoriesData(
  categories: CategoriesForm[]
): CategoriesData[] {
  return categories?.map((category) => {
    return {
      name: category.categoryName,
      criteria: [],
    };
  });
}

@Component({
  selector: 'app-unidad',
  standalone: true,
  imports: [
    ButtonModule,
    TableModule,
    CommonModule,
    TagModule,
    DialogModule,
    InputTextModule,
    FormsModule,
    FloatLabelModule,
    DialogCreateComponent,
    DialogEditComponent,
    PaginatorModule,
    SkeletonModule,
  ],
  templateUrl: './unidad.component.html',
  styleUrl: './unidad.component.scss',
})
export class UnidadComponent implements OnInit {
  unitsData: UnitsGet[] = [];
  visible: boolean = false;
  editingUnit: any;
  viewingUnit: any;
  visibleView: boolean = false;
  paginationRows = 10;
  first: number = 0;
  totalRecords: number = 0;
  indicators: Indicators[] = [];
  loadingItems = true;

  constructor(
    private readonly unitsService: UnitsService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    this.route.queryParams.subscribe((params) => {
      this.loadingItems = true;
      const page = +params['page'] || 1;
      this.first = (page - 1) * this.paginationRows;
      this.unitsService.getUnits(page, this.paginationRows).subscribe({
        next: (response) => {
          this.unitsData = response.data.items;
          this.totalRecords = response.data.itemCount;
          this.paginationRows = response.data.itemsPerPage;
          this.loadingItems = false;
        },
        error: (error: CustomHttpErrorResponse) => {
          console.error(error);
          this.loadingItems = false;
        },
      });
    });

    this.unitsService.getAllIndicators().subscribe({
      next: (response) => {
        this.indicators = response.data;
      },
      error: (error: CustomHttpErrorResponse) => {
        console.error('Error al obtener los indicadores:', error);
      },
    });
  }

  showDialog() {
    this.visible = true;
  }

  hideDialog() {
    this.visible = false;
  }

  create(unit: any) {
    this.unitsData.push(unit);
  }

  visibleEdit: boolean = false;

  showDialogEdit(unit: any) {
    this.editingUnit = unit;
    this.visibleEdit = true;
  }

  hideDialogEdit() {
    this.visibleEdit = false;
    this.editingUnit = {
      id: '',
      name: '',
      email: '',
      recommendedCatgeories: [],
    };
  }

  update({ value, id }: { value: UnitsGet; id: string }) {
    const indexToUpdate = this.unitsData.findIndex((unit) => unit.id === id);
    this.unitsData[indexToUpdate] = value;
  }

  onPageChange(event: PageEvent) {
    this.loadingItems = true;
    this.unitsService
      .getUnits(
        event.page ? event.page + 1 : 1,
        event.rows ? event.rows : this.paginationRows
      )
      .subscribe({
        next: (response) => {
          this.unitsData = response.data.items;
          this.totalRecords = response.data.itemCount;
          this.loadingItems = false;
          if (event.rows) this.paginationRows = event.rows;
          if (event.first) this.first = event.first;

          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page: event.page ? event.page + 1 : 1 },
            queryParamsHandling: 'merge', // preserve the existing query params
          });
        },
        error: (error: CustomHttpErrorResponse) => {
          console.error(error);
          this.loadingItems = false;
        },
      });
  }

  ngOnInit(): void {}

  delete(id: string) {
    const idDelete = this.unitsData.findIndex((i) => i.id === id);
    this.unitsData.splice(idDelete, 1);
  }

  view(unit: any) {
    this.viewingUnit = unit;
    this.visibleView = true;
  }

  hideDialogView() {
    this.visibleView = false;
  }
}
