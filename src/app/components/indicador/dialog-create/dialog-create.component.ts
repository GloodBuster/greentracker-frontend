import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { ToastrService } from 'ngx-toastr';
import { IndicatorService } from '../../../services/indicator/indicator.service';
import { Indicator } from '../../../interfaces/indicator/indicator';
import { CustomHttpErrorResponse, ErrorResponse } from '../../../interfaces/responses/error';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-dialog-create',
  standalone: true,
  imports: [
    DialogModule,
    InputTextModule,
    FormsModule,
    FloatLabelModule,
    ButtonModule,
    PanelModule,
    ReactiveFormsModule,
    InputNumberModule,
  ],
  templateUrl: './dialog-create.component.html',
  styleUrl: './dialog-create.component.scss',
})
export class DialogCreateComponent {
  @Input() visible: boolean = false;
  @Output() hide: EventEmitter<any> = new EventEmitter();
  @Output() create: EventEmitter<any> = new EventEmitter<any>();
  loading = false;

  constructor(private indicatorService: IndicatorService) {}

  hideDialog() {
    this.hide.emit();
  }
  toastService = inject(ToastrService);
  indicatorForm = new FormGroup({
    index: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
    ]),
    englishName: new FormControl('', [Validators.required]),
    spanishAlias: new FormControl('', [Validators.required]),
  });

  submitForm() {
    if (this.indicatorForm.valid) {
      this.loading = true;
      const indicator: Indicator = {
        index: this.indicatorForm.value.index ?? 0,
        englishName: this.indicatorForm.value.englishName ?? '',
        spanishAlias: this.indicatorForm.value.spanishAlias ?? '',
      };

      this.indicatorService.createIndicator(indicator).subscribe({
        next: (response) => {
          this.create.emit(this.indicatorForm.value);
          this.hideDialog();
          this.toastService.success('Indicador creado con éxito');
          this.indicatorForm.reset();
          this.loading = false;
        },
        error: (error: CustomHttpErrorResponse) => {
          this.toastService.error(error.error.message);
          this.loading = false;
        },
      });
    } else {
      this.toastService.error('Ha ocurrido un error');
      this.loading = false;
    }
  }
}
