import { Component, EventEmitter, Input, Output, SimpleChanges, inject } from '@angular/core';
import {FormControl,
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
import { MultiSelectModule } from 'primeng/multiselect';
import { UnitsService } from '../../../services/units/units.service';
import { CategoriesData, CategoriesForm, Indicators, UnitsForm } from '../../../interfaces/units/units';
import { CustomHttpErrorResponse } from '../../../interfaces/responses/error';
import { CategoriesDataToForm } from '../../../pages/admin/unidad/unidad.component';

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
    MultiSelectModule,
  ],
  templateUrl: './dialog-create.component.html',
  styleUrl: './dialog-create.component.scss',
})
export class DialogCreateComponent {
  @Input() visible: boolean = false;
  @Output() hide: EventEmitter<any> = new EventEmitter();
  @Output() create: EventEmitter<any> = new EventEmitter<any>();
  @Input() indicators: Indicators[] = [];
  loading = false;
  selectedCategories: CategoriesData[] = [];
  selectedIndicator: Indicators | undefined;
  indicatorIndex = 0;
  loadingIndicators = true;

  constructor(private unitsService: UnitsService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['indicators'] && changes['indicators'].currentValue.length > 0) {
      this.loadingIndicators = false;
    }
  }

  hideDialog() {
    this.hide.emit();
    this.unitsForm.reset();
  }
  toastService = inject(ToastrService);
  unitsForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    recommendedCategories: new FormControl<CategoriesData[] | CategoriesForm[]>(
      [],
      [Validators.required]
    ),
  });

  submitForm() {
    if (this.unitsForm.valid) {
      this.loading = true;
      const categories = this.unitsForm.value
        .recommendedCategories as CategoriesData[];
      this.unitsForm.value.recommendedCategories = CategoriesDataToForm(categories, this.indicators);
      const unit = this.unitsForm.value as UnitsForm;
      this.unitsService.addNewUnit(unit).subscribe({
        next: (response) => {
          this.create.emit(response.data);
          this.toastService.success('Unidad agregada con éxito');
          this.loading = false;
          this.hideDialog();
        },
        error: (error: CustomHttpErrorResponse) => {
          this.toastService.error('Error al agregar la unidad');
          console.error('Error al agregar la unidad:', error.error);
          this.loading = false;
        },
      });
    }
  }
}

