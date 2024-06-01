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
import { Criterion } from '../../../interfaces/criteria/criteria';
import { CustomHttpErrorResponse } from '../../../interfaces/responses/error';

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
  @Output() addCriterion: EventEmitter<Criterion> = new EventEmitter();
  criteriaService = inject(CriteriaService);

  criterionForm = new FormGroup({
    indicatorIndex: new FormControl(0, [Validators.required]),
    subindex: new FormControl(0, [Validators.required]),
    englishName: new FormControl('', [Validators.required]),
    spanishAlias: new FormControl('', [Validators.required]),
    categoryName: new FormControl('', [Validators.required]),
  });

  hide() {
    this.hideDialog.emit();
    this.criterionForm.reset();
  }

  submitForm() {
    if (this.criterionForm.valid) {
      const criterion = this.criterionForm.value as Criterion;
      /*this.criteriaService.addNewCriterion(criterion).subscribe({
        next: (response) => {
          console.log(response);
          this.addCriterion.emit(response.data);
        },
        error: (error: CustomHttpErrorResponse) => {
          console.log(error);
        },
      });*/
      this.addCriterion.emit(criterion);
      this.hide();
    }
  }
}
