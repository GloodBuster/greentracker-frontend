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
import { ActivatedRoute } from '@angular/router';

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
  criterionToEdit: CriterionForm = initialCriterionForm;
  indicatorIndex = 0;

  constructor(
    private readonly criteriaService: CriteriaService,
    private readonly route: ActivatedRoute
  ) {
    const indicatorIndex = this.route.snapshot.paramMap.get('indicatorIndex');
    if (indicatorIndex) this.indicatorIndex = parseInt(indicatorIndex);
    this.criteriaService.getCriteriaByIndex(this.indicatorIndex).subscribe({
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
}
