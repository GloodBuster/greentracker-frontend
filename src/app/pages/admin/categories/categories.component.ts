import { Component, inject } from '@angular/core';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { Categories, CategoriesForm, initialCategoriesForm } from '../../../interfaces/categories/categories';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '../../../services/categories/categories.service';
import { CustomHttpErrorResponse } from '../../../interfaces/responses/error';
import { DialogCreateComponent } from '../../../components/category/dialog-create/dialog-create.component';
import { DialogEditComponent } from '../../../components/category/dialog-edit/dialog-edit.component';

interface PageEvent {
  first?: number;
  rows?: number;
  page?: number;
  pageCount?: number;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [SidebarComponent, ButtonModule, TableModule, CommonModule, PaginatorModule, DialogCreateComponent, DialogEditComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
 categories: Categories[] = [];
 toastService = inject(ToastrService);
 indicatorIndex = 0;
  totalRecords = 0;
  paginationRows = 10;
  first = 0;
  visibleCreate = false;
  visibleEdit = false;
  categoryToEdit: CategoriesForm = initialCategoriesForm;

  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ){
    const indicatorIndex = this.route.snapshot.paramMap.get('indicatorIndex');
    if (indicatorIndex) this.indicatorIndex = parseInt(indicatorIndex);

    this.route.queryParams.subscribe((params) => {
      const page = +params['page'] || 1;
      this.first = (page - 1) * this.paginationRows;
      this.categoriesService
        .getCategoriesByIndex(this.indicatorIndex, page)
        .subscribe({
          next: (response) => {
            console.log(response);
            this.categories = response.data.items;
            this.totalRecords = response.data.itemCount;
            this.paginationRows = response.data.itemsPerPage;
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
    });
  }
  showCreate() {
    this.visibleCreate = true;
  }
  hideCreate() {
    this.visibleCreate = false;
  }
  createCategory(category: CategoriesForm){
    this.categories.push({indicatorIndex: this.indicatorIndex, ...category});
  }
  showEdit(category: Categories){
    this.categoryToEdit = category;
    this.visibleEdit = true;
  }
  hideEdit(){
    this.visibleEdit = false;
    this.categoryToEdit = initialCategoriesForm;
  }
  editCategory({
    category,
    name,
  }: {
    category: CategoriesForm;
    name: string;
  }) {
    const indexToUpdate = this.categories.findIndex(
      (category) => category.name === name
    );
    this.categories[indexToUpdate] = {
      indicatorIndex: this.indicatorIndex,
      ...category,
    };
  }
  deleteCategory({ name }: { name: string }) {
    const index = this.categories.findIndex(
      (category) => category.name === name
    );
    this.categories.splice(index, 1);
  }

  onPageChange(event: PageEvent) {
    this.categoriesService
      .getCategoriesByIndex(this.indicatorIndex, event.page ? event.page + 1 : 1)
      .subscribe({
        next: (response) => {
          this.categories = response.data.items;
          this.totalRecords = response.data.itemCount;
          if (event.rows) this.paginationRows = event.rows;
          if (event.first) this.first = event.first;

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
        },
      });
}
}
