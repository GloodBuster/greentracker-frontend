import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import * as data from '../../../../assets/unitsData.json';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DialogCreateComponent } from '../../../components/unidad/dialog-create/dialog-create.component';
import { DialogEditComponent } from '../../../components/unidad/dialog-edit/dialog-edit.component';
import { UnitsGet } from '../../../interfaces/units/units';
import { UnitsService } from '../../../services/units/units.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomHttpErrorResponse } from '../../../interfaces/responses/error';
import { PaginatorModule } from 'primeng/paginator';

interface PageEvent {
  first?: number;
  rows?: number;
  page?: number;
  pageCount?: number;
}

@Component({
  selector: 'app-unidad',
  standalone: true,
  imports: [ButtonModule, TableModule, CommonModule, TagModule, DialogModule, InputTextModule, FormsModule, FloatLabelModule, DialogCreateComponent, DialogEditComponent, PaginatorModule],
  templateUrl: './unidad.component.html',
  styleUrl: './unidad.component.scss'
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

  constructor(
    private readonly unitsService: UnitsService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) { 
    this.route.queryParams.subscribe((params) => {
      const page = +params['page'] || 1;
      this.first = (page - 1) * this.paginationRows;
      this.unitsService.getUnits(page, this.paginationRows).subscribe({
        next: (response) => {
          this.unitsData = response.data.items;
          this.totalRecords = response.data.itemCount;
          this.paginationRows = response.data.itemsPerPage;
        },
        error: (error: CustomHttpErrorResponse) => {
          console.error(error);
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
  this.editingUnit = {id: '', name: '', email: ''};
}

  update({value, id}: { value: UnitsGet, id: string }) {
    console.log(value, id);
    const indexToUpdate = this.unitsData.findIndex((unit) => unit.id === id);
    this.unitsData[indexToUpdate] = value;
  }

  onPageChange(event: PageEvent) {
    this.unitsService
    .getUnits(event.page ? event.page + 1 : 1, event.rows ? event.rows : this.paginationRows)
    .subscribe({
      next: (response) => {
        this.unitsData = response.data.items;
        this.totalRecords = response.data.itemCount;
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
      }
    });
  }

  ngOnInit(): void {
  }




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