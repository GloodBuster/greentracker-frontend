import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IndicatorService } from '../../../services/indicator/indicator.service';
import { DropdownModule } from 'primeng/dropdown';
import { Criterion } from '../../../interfaces/criteria/criteria';
import { CustomHttpErrorResponse } from '../../../interfaces/responses/error';
import { ToastrService } from 'ngx-toastr';

interface IndicatorWithCriteria {
  index: number;
  englishName: string;
  spanishAlias: string;
  criteria: Criterion[];
}

@Component({
  selector: 'app-generate-report',
  standalone: true,
  imports: [DialogModule, ReactiveFormsModule, ButtonModule, DropdownModule],
  templateUrl: './generate-report.component.html',
  styleUrl: './generate-report.component.scss',
})
export class GenerateReportComponent {
  @Input() visible: boolean = false;
  @Output() hideDialog: EventEmitter<void> = new EventEmitter();
  loading = false;
  indicators: IndicatorWithCriteria[] = [];
  loadingIndicators = false;

  reportFormGroup = new FormGroup({
    criterion: new FormControl<Criterion | null>(null, [Validators.required]),
  });

  constructor(
    private readonly indicatorService: IndicatorService,
    private readonly toastService: ToastrService
  ) {
    this.loadingIndicators = true;
    this.indicatorService.getAllIndicators().subscribe({
      next: (response) => {
        this.indicators = response.data
          .map((indicator) => {
            return {
              index: indicator.index,
              englishName: indicator.englishName,
              spanishAlias: indicator.spanishAlias,
              criteria: indicator.categories
                .map((category) => {
                  return category.criteria;
                })
                .flat(),
            };
          })
          .filter((indicator) => indicator.criteria.length > 0);
        this.loadingIndicators = false;
      },
      error: (error: CustomHttpErrorResponse) => {
        if (error.error.statusCode === 500) {
          this.toastService.error(
            'Ha ocurrido un error al cargar los criterios'
          );
        } else {
          this.toastService.error(error.error.message);
        }
      },
    });
  }

  hide() {
    this.hideDialog.emit();
  }

  generateReport() {
    if (!this.reportFormGroup.valid) return;
    this.loading = true;

    const indicator = this.indicators.find((indicator) =>
      indicator.criteria.some(
        (criterion) =>
          criterion.englishName ===
            this.reportFormGroup.value.criterion?.englishName &&
          criterion.subindex === this.reportFormGroup.value.criterion.subindex
      )
    );
    if (indicator && this.reportFormGroup.value.criterion) {
      this.toastService.info('Generando documento');
      this.indicatorService
        .getCriterionReport(
          indicator?.index,
          this.reportFormGroup?.value?.criterion?.subindex
        )
        .subscribe({
          next: (response) => {
            const blob = response;
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.setAttribute(
              'download',
              `Criterio ${indicator.index}.${this.reportFormGroup?.value?.criterion?.subindex} - Reporte.docx`
            );
            a.setAttribute('href', url);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            this.loading = false;
            this.hide();
          },
        });
    }
  }
}
