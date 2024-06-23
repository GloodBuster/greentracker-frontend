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
import { ChargePeriodService } from '../../../services/charge-period/charge-period.service';
import { adjustDateForTimezone, convertToUTCDate } from '../../../utils/date';

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

  constructor(private readonly chargePeriodService: ChargePeriodService) {
    this.chargePeriodService.getChargePeriod().subscribe({
      next: (response) => {
        let startDateUTC = convertToUTCDate(response.data.startTimestamp);

        let endDateUTC = convertToUTCDate(response.data.endTimestamp);

        startDateUTC = adjustDateForTimezone(startDateUTC);
        endDateUTC = adjustDateForTimezone(endDateUTC);

        this.chargePeriodFormGroup.setValue({
          startDate: startDateUTC,
          endDate: endDateUTC,
        });
      },
    });
  }

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
        this.loading = true;
        if (!startDate || !endDate) {
          this.toastService.error('Por favor, seleccione una fecha válida.');
          this.loading = false;
          return;
        }
        const formStartDate = startDate.toISOString().slice(0, 10);
        const formEndDate = endDate.toISOString().slice(0, 10);
        this.chargePeriodService
          .updateChargePeriod({
            startTimestamp: formStartDate,
            endTimestamp: formEndDate,
          })
          .subscribe({
            next: () => {
              this.toastService.success('Periodo de carga actualizado');
              this.hide();
            },
            error: () => {
              this.toastService.error('Ha ocurrido un error inesperado');
            },
            complete: () => {
              this.loading = false;
            },
          });
      }
    }
  }
}
