import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CriteriaService } from '../../../services/criteria/criteria.service';
import {
  Criterion,
  initialCriterion,
} from '../../../interfaces/criteria/criteria';
import { CustomHttpErrorResponse } from '../../../interfaces/responses/error';
import { ToastrService } from 'ngx-toastr';
import { TableModule } from 'primeng/table';
import { DialogCreateComponent } from '../../../components/criteria/dialog-create/dialog-create.component';
import { DialogEditComponent } from '../../../components/criteria/dialog-edit/dialog-edit.component';

@Component({
  selector: 'app-criteria',
  standalone: true,
  imports: [
    ButtonModule,
    TableModule,
    DialogCreateComponent,
    DialogEditComponent,
  ],
  templateUrl: './criteria.component.html',
  styleUrl: './criteria.component.scss',
})
export class CriteriaComponent {
  criteria: Criterion[] = [];
  toastService = inject(ToastrService);
  visibleEdit = false;
  visibleCreate = false;
  criterionToEdit: Criterion = initialCriterion;

  constructor(private readonly criteriaService: CriteriaService) {
    this.criteriaService.getCriteriaByIndex(1).subscribe({
      next: (response) => {
        this.criteria = response.data.items;
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

  editCriterion({
    criterion,
    indicatorIndex,
    subindex,
  }: {
    criterion: Criterion;
    indicatorIndex: number;
    subindex: number;
  }) {
    const indexToUpdate = this.criteria.findIndex(
      (criterion) =>
        criterion.indicatorIndex === indicatorIndex &&
        criterion.subindex === subindex
    );
    this.criteria[indexToUpdate] = criterion;
  }

  deleteCriterion({
    indicatorIndex,
    subindex,
  }: {
    indicatorIndex: number;
    subindex: number;
  }) {
    const index = this.criteria.findIndex(
      (criterion) =>
        criterion.indicatorIndex === indicatorIndex &&
        criterion.subindex === subindex
    );
    this.criteria.splice(index, 1);
  }

  addNewCriterion(criterion: Criterion) {
    this.criteria.push(criterion);
  }

  showEdit(criterion: Criterion) {
    this.criterionToEdit = criterion;
    this.visibleEdit = true;
  }

  hideEdit() {
    this.visibleEdit = false;
    this.criterionToEdit = initialCriterion;
  }

  showCreate() {
    this.visibleCreate = true;
  }

  hideCreate() {
    this.visibleCreate = false;
  }
}
