import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-period',
  standalone: true,
  imports: [DialogModule, CalendarModule, ReactiveFormsModule],
  templateUrl: './change-period.component.html',
  styleUrl: './change-period.component.scss',
})
export class ChangePeriodComponent {
  @Input() visible: boolean = false;
  @Output() hideDialog: EventEmitter<void> = new EventEmitter();
  loading = false;
  toastService = inject(ToastrService);

  chargePeriodFormGroup = new FormGroup({
    startDate: new FormControl<Date | null>(null, [Validators.required]),
    endDate: new FormControl<Date | null>(null, [Validators.required]),
  });

  hide() {
    this.hideDialog.emit();
  }

  submitForm() {
    if (this.chargePeriodFormGroup.valid) {
      const startDate = this.chargePeriodFormGroup.value?.startDate;
      const endDate = this.chargePeriodFormGroup.value?.endDate;

      if (startDate && endDate && startDate >= endDate) {
        this.toastService.error(
          'La fecha de inicio debe ser menor a la fecha final.'
        );
      } else {
      }
    }
  }
}
