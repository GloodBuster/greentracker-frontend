import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
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
import { CommonModule } from '@angular/common';
import { IndicatorService } from '../../../services/indicator/indicator.service';
import { indicatorForm } from '../../../interfaces/indicator/indicator';
import {
  CustomHttpErrorResponse,
  ErrorResponse,
} from '../../../interfaces/responses/error';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    FloatLabelModule,
    PanelModule,
    CommonModule,
    InputNumberModule,
    ConfirmPopupModule,
    ToastModule,
  ],
  templateUrl: './dialog-edit.component.html',
  styleUrl: './dialog-edit.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class DialogEditComponent {
  @Input() indicador: indicatorForm = {
    index: 0,
    englishName: '',
    spanishAlias: '',
    categories: [
      {
        name: '',
        criteria: [
          { subindex: 0, englishName: '', spanishAlias: '', categoryName: '' },
        ],
      },
    ],
  };
  @Input() visible: boolean = false;
  @Output() hide: EventEmitter<any> = new EventEmitter();
  @Output() update: EventEmitter<{ value: indicatorForm; index: number }> =
    new EventEmitter<any>();
  @Output() delete: EventEmitter<any> = new EventEmitter<any>();
  loading = false;
  deleteLoading = false;

  allCriteriaEmpty(): boolean {
    return (
      this.indicador?.categories.every(
        (category) => category.criteria.length === 0
      ) ?? true
    );
  }

  constructor(
    private indicatorService: IndicatorService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  showConfirmDialog = false;

  indicadorForm = new FormGroup({
    index: new FormControl(this.indicador.index, [Validators.required]),
    englishName: new FormControl(this.indicador.englishName, [
      Validators.required,
    ]),
    spanishAlias: new FormControl(this.indicador.spanishAlias, [
      Validators.required,
    ]),
  });

  toastService = inject(ToastrService);

  hideDialogEdit() {
    this.indicadorForm.reset();
    this.indicador = {
      index: 0,
      englishName: '',
      spanishAlias: '',
      categories: [
        {
          name: '',
          criteria: [
            {
              subindex: 0,
              englishName: '',
              spanishAlias: '',
              categoryName: '',
            },
          ],
        },
      ],
    };
    this.hide.emit();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['indicador'] && changes['indicador'].currentValue) {
      this.indicadorForm.setValue({
        index: changes['indicador'].currentValue.index,
        englishName: changes['indicador'].currentValue.englishName,
        spanishAlias: changes['indicador'].currentValue.spanishAlias,
      });
    }
  }

  submitForm() {
    if (this.indicadorForm.valid) {
      this.loading = true;
      const indicator: indicatorForm = {
        index: this.indicadorForm.value.index ?? 0,
        englishName: this.indicadorForm.value.englishName ?? '',
        spanishAlias: this.indicadorForm.value.spanishAlias ?? '',
        categories: this.indicador.categories ?? [
          {
            name: '',
            criteria: [
              {
                subindex: 0,
                englishName: '',
                spanishAlias: '',
                categoryName: '',
              },
            ],
          },
        ],
      };
      this.indicatorService
        .editIndicator(indicator, this.indicador.index)
        .subscribe({
          next: (response) => {
            this.loading = false;
            this.update.emit({ value: indicator, index: this.indicador.index });
            this.hideDialogEdit();
            this.toastService.success('Indicador editado con éxito');
            this.indicadorForm.reset();
          },
          error: (error: CustomHttpErrorResponse) => {
            this.toastService.error(error.error.message);
            this.loading = false;
          },
        });
    } else {
      this.toastService.error('Ha ocurrido un error');
    }
  }

  cancelDelete() {
    this.showConfirmDialog = false;
  }

  confirmDelete() {
    this.loading = true;
    const index = this.indicador.index;
    this.indicatorService.deleteIndicator(index).subscribe({
      next: (response) => {
        this.delete.emit(index);
        this.hideDialogEdit();
        this.toastService.success('Indicador eliminado con éxito');
        this.showConfirmDialog = false;
        this.loading = false;
      },
      error: (error: CustomHttpErrorResponse) => {
        this.deleteLoading = false;
        this.toastService.error('Ha ocurrido un error inesperado');
        console.error('Error al eliminar el indicador:', error);
      },
    });
  }

  deleteIndicador() {
    if (this.indicadorForm.valid) {
      this.showConfirmDialog = true;
    } else {
      this.toastService.error('Ha ocurrido un error');
    }
  }

  confirm(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      acceptIcon: 'pi pi-trash mr-5',
      acceptLabel: 'Eliminar',
      acceptButtonStyleClass:
        'p-button-sm p-button-danger no-outline button-separation',
      rejectVisible: false,
      accept: () => {
        this.deleteIndicador();
      },
    });
  }

  editCriteria() {
    this.router.navigate(['/criteria'], {
      queryParams: { index: this.indicador.index },
    });
  }
}
