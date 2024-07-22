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
  CriterionForm,
  initialCriterionForm,
} from '../../../interfaces/criteria/criteria';
import { ActivatedRoute } from '@angular/router';
import { CriteriaService } from '../../../services/criteria/criteria.service';
import { CustomHttpErrorResponse } from '../../../interfaces/responses/error';
import { ToastrService } from 'ngx-toastr';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

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
    ConfirmPopupModule,
    ToastModule,
  ],
  templateUrl: './dialog-edit.component.html',
  styleUrl: './dialog-edit.component.scss',
  providers: [ConfirmationService, MessageService],
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
  loading = false;
  deleteLoading = false;

  constructor(
    private readonly route: ActivatedRoute,
    private confirmationService: ConfirmationService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.indicatorIndex = +params['index'];
    });
  }

  criterionForm = new FormGroup({
    subindex: new FormControl(this.criterion.subindex, [Validators.required]),
    englishName: new FormControl(this.criterion.englishName, [
      Validators.required,
    ]),
    spanishAlias: new FormControl(this.criterion.spanishAlias, [
      Validators.required,
    ]),
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['criterion'] && changes['criterion'].currentValue) {
      this.criterionForm.setValue({
        subindex: changes['criterion'].currentValue.subindex,
        englishName: changes['criterion'].currentValue.englishName,
        spanishAlias: changes['criterion'].currentValue.spanishAlias,
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
      this.loading = true;
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
            this.loading = false;
            this.hide();
          },
          error: (error: CustomHttpErrorResponse) => {
            if (error.error.statusCode === 500) {
              this.toastService.error('Ha ocurrido un error inesperado');
            } else {
              this.toastService.error(error.error.message);
            }
            this.loading = false;
          },
        });
    }
  }

  hideDelete() {
    this.visibleDelete = false;
  }

  confirmDelete() {
    this.deleteLoading = true;
    this.criteriaService
      .deleteCriterion(this.indicatorIndex, this.criterion.subindex)
      .subscribe({
        next: (response) => {
          this.deleteCriterion.emit({
            subindex: response.data.subindex,
          });
          this.toastService.success('Se ha eliminado el criterio');
          this.deleteLoading = false;
          this.hideDelete();
          this.hide();
        },
        error: (error: CustomHttpErrorResponse) => {
          this.deleteLoading = false;
          this.toastService.error('Ha ocurrido un error inesperado');
        },
      });
  }

  showDelete() {
    this.visibleDelete = true;
  }

  confirm(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      acceptIcon: 'pi pi-trash mr-5',
      acceptLabel: 'Eliminar',
      acceptButtonStyleClass:
        'p-button-sm p-button-danger no-outline button-separation',
      rejectVisible: false, // hide reject button
      accept: () => {
        this.showDelete();
      },
    });
  }
}
