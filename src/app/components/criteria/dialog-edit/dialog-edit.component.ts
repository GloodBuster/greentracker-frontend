import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import {
  Criterion,
  CriterionForm,
  initialCriterionForm,
} from '../../../interfaces/criteria/criteria';
import { ActivatedRoute } from '@angular/router';
import { CriteriaService } from '../../../services/criteria/criteria.service';
import { CustomHttpErrorResponse } from '../../../interfaces/responses/error';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog-edit',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputNumberModule,
    InputNumberModule,
    InputTextModule,
    DropdownModule,
  ],
  templateUrl: './dialog-edit.component.html',
  styleUrl: './dialog-edit.component.scss',
})
export class DialogEditComponent {
  @Input() visible: boolean = false;
  @Input() criterion: CriterionForm = initialCriterionForm;
  @Output() hideDialog: EventEmitter<void> = new EventEmitter();
  @Output() editCriterion: EventEmitter<{
    criterion: CriterionForm;
    subindex: number;
  }> = new EventEmitter();
  @Output() deleteCriterion: EventEmitter<{
    subindex: number;
  }> = new EventEmitter();
  indicatorIndex = 0;
  criteriaService = inject(CriteriaService);
  toastService = inject(ToastrService);
  visibleDelete = false;

  constructor(private readonly route: ActivatedRoute) {
    const indicatorIndex = this.route.snapshot.paramMap.get('indicatorIndex');
    if (indicatorIndex) this.indicatorIndex = parseInt(indicatorIndex);
  }

  criterionForm = new FormGroup({
    subindex: new FormControl(this.criterion.subindex, [Validators.required]),
    englishName: new FormControl(this.criterion.englishName, [
      Validators.required,
    ]),
    spanishAlias: new FormControl(this.criterion.spanishAlias, [
      Validators.required,
    ]),
    categoryName: new FormControl(this.criterion.categoryName, [
      Validators.required,
    ]),
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['criterion'] && changes['criterion'].currentValue) {
      this.criterionForm.setValue({
        subindex: changes['criterion'].currentValue.subindex,
        englishName: changes['criterion'].currentValue.englishName,
        spanishAlias: changes['criterion'].currentValue.spanishAlias,
        categoryName: changes['criterion'].currentValue.categoryName,
      });
    }
  }

  hide() {
    this.hideDialog.emit();
    this.criterionForm.reset();
    this.criterion = initialCriterionForm;
  }
  updateCriterion() {
    if (this.criterionForm.valid) {
      const criterion: CriterionForm = this.criterionForm
        .value as CriterionForm;
      this.criteriaService
        .updateCriterion(
          this.indicatorIndex,
          this.criterion.subindex,
          criterion
        )
        .subscribe({
          next: (response) => {
            this.editCriterion.emit({
              criterion: response.data,
              subindex: this.criterion.subindex,
            });
            this.toastService.success('Criterio actualizado con éxito');
            this.hide();
          },
          error: (error: CustomHttpErrorResponse) => {
            this.toastService.error('Ha ocurrido un error inesperado');
          },
        });
    }
  }

  hideDelete() {
    this.visibleDelete = false;
  }

  confirmDelete() {
    this.criteriaService
      .deleteCriterion(this.indicatorIndex, this.criterion.subindex)
      .subscribe({
        next: (response) => {
          this.deleteCriterion.emit({
            subindex: response.data.subindex,
          });
          this.toastService.success('Se ha eliminado el criterio');
          this.hideDelete();
          this.hide();
        },
        error: (error: CustomHttpErrorResponse) => {
          this.toastService.error('Ha ocurrido un error inesperado');
        },
      });
  }

  showDelete() {
    this.visibleDelete = true;
  }
}
