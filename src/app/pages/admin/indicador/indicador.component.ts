import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DialogCreateComponent } from '../../../components/indicador/dialog-create/dialog-create.component';
import { DialogEditComponent } from '../../../components/indicador/dialog-edit/dialog-edit.component';
import { IndicatorService } from '../../../services/indicator/indicator.service';
import { Indicator, indicatorForm } from '../../../interfaces/indicator/indicator';
import { CustomHttpErrorResponse } from '../../../interfaces/responses/error';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginatorModule } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';

interface PageEvent{
  first?: number;
  rows?: number;
  page?: number;
  pageCount?: number;

}
@Component({
  selector: 'app-indicador',
  standalone: true,
  imports: [ButtonModule, TableModule, CommonModule, TagModule, DialogModule, InputTextModule, FormsModule, FloatLabelModule, DialogCreateComponent, DialogEditComponent, PaginatorModule, SkeletonModule],
  templateUrl: './indicador.component.html',
  styleUrl: './indicador.component.scss'
})
export class IndicadorComponent {
  indicatorsData: indicatorForm[] = [];
  visible: boolean = false;
  editingIndicator: any;
  paginationRows = 10;
  first: number = 0;
  totalRecords: number = 0;
  loadingItems = true;

  constructor(
    private readonly indicatorService: IndicatorService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) { 
    this.route.queryParams.subscribe((params) => {
      this.loadingItems = true;
      const page = +params['page'] || 1;
      this.first = (page - 1) * this.paginationRows;
      this.indicatorService.getIndicators(page, this.paginationRows).subscribe({
        next: (response) => {
          this.indicatorsData = response.data.items;
          this.totalRecords = response.data.itemCount;
          this.paginationRows = response.data.itemsPerPage;
          this.loadingItems = false;
        },
        error: (error: CustomHttpErrorResponse) => {
          console.error(error);
          this.loadingItems = false;
        }
      })
    });
  }
  
  showDialog() {
    this.visible = true;
  }
  hideDialog() {
    this.visible = false;
  }
  create(indicator: any) {
    this.indicatorsData.push(indicator);
  }
  visibleEdit: boolean = false;

  showDialogEdit(indicator: any) {
    this.editingIndicator = indicator;
    this.visibleEdit = true;
  }
  
  hideDialogEdit() {
    this.visibleEdit = false;
    this.editingIndicator = {index: 0, englishName: '', spanishAlias: '', categories: [{name: '', criteria: [{subindex: 0, englishName: '', spanishAlias: '', categoryName: ''}]}]};
  }

  update({value,index}: { value: indicatorForm, index: number }) {
    const indexToUpdate = this.indicatorsData.findIndex((indicator) => indicator.index === index);
    this.indicatorsData[indexToUpdate] = value;
  }
  delete(index: number) {
    const indexDelete = this.indicatorsData.findIndex((i) => i.index === index);
    this.indicatorsData.splice(indexDelete, 1);
  }
  onPageChange(event: PageEvent) {
    this.loadingItems = true;
    this.indicatorService
      .getIndicators(event.page ? event.page + 1 : 1, event.rows ? event.rows : this.paginationRows)
      .subscribe({
        next: (response) => {
          this.indicatorsData = response.data.items;
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
          this.loadingItems = false
        },
      });
  }
}
