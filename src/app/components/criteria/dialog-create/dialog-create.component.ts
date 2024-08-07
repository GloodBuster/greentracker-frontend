import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CriteriaService } from '../../../services/criteria/criteria.service';
import { CriterionForm } from '../../../interfaces/criteria/criteria';
import { CustomHttpErrorResponse } from '../../../interfaces/responses/error';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog-create',
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
  templateUrl: './dialog-create.component.html',
  styleUrl: './dialog-create.component.scss',
})
export class DialogCreateComponent {
  @Input() visible: boolean = false;
  @Output() hideDialog: EventEmitter<void> = new EventEmitter();
  @Output() addCriterion: EventEmitter<CriterionForm> = new EventEmitter();
  criteriaService = inject(CriteriaService);
  toastService = inject(ToastrService);
  indicatorIndex = 0;
  loading = false;

  constructor(private readonly route: ActivatedRoute) {
    this.route.queryParams.subscribe((params) => {
      this.indicatorIndex = +params['index'];
    });
  }

  criterionForm = new FormGroup({
    subindex: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
    ]),
    englishName: new FormControl('', [Validators.required]),
    spanishAlias: new FormControl('', [Validators.required]),
  });

  hide() {
    this.hideDialog.emit();
    this.criterionForm.reset();
  }

  submitForm() {
    if (this.criterionForm.valid) {
      this.loading = true;
      const criterion = this.criterionForm.value as CriterionForm;
      this.criteriaService
        .addNewCriterion(this.indicatorIndex, criterion)
        .subscribe({
          next: (response) => {
            this.addCriterion.emit(response.data);
            this.toastService.success('Criterio agregado con éxito');
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
}
