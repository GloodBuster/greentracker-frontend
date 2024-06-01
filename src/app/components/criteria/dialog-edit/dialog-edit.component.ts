import {
  Component,
  EventEmitter,
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
  initialCriterion,
} from '../../../interfaces/criteria/criteria';

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
  @Input() criterion: Criterion = initialCriterion;
  @Output() hideDialog: EventEmitter<void> = new EventEmitter();
  @Output() editCriterion: EventEmitter<{
    criterion: Criterion;
    indicatorIndex: number;
    subindex: number;
  }> = new EventEmitter();
  @Output() deleteCriterion: EventEmitter<{
    indicatorIndex: number;
    subindex: number;
  }> = new EventEmitter();

  criterionForm = new FormGroup({
    indicatorIndex: new FormControl(this.criterion.indicatorIndex, [
      Validators.required,
    ]),
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
        indicatorIndex: changes['criterion'].currentValue.indicatorIndex,
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
    this.criterion = initialCriterion;
  }
  updateCriterion() {
    const criterion: Criterion = this.criterionForm.value as Criterion;
    this.editCriterion.emit({
      criterion,
      indicatorIndex: this.criterion.indicatorIndex,
      subindex: this.criterion.subindex,
    });
    this.hide();
  }
  removeCriterion() {
    this.deleteCriterion.emit({
      indicatorIndex: this.criterion.indicatorIndex,
      subindex: this.criterion.subindex,
    });
    this.hide();
  }
}
