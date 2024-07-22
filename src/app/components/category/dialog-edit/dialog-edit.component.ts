import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  inject,
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
import { InputTextModule } from 'primeng/inputtext';
import {
  CategoriesByIndicator,
  CategoriesForm,
  CriteriaSubIndex,
} from '../../../interfaces/categories/categories';
import { CategoriesService } from '../../../services/categories/categories.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { CustomHttpErrorResponse } from '../../../interfaces/responses/error';
import {
  Criterion,
  CriterionForm,
} from '../../../interfaces/criteria/criteria';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextareaModule } from 'primeng/inputtextarea';

export function CriterionFormToCriterion(
  criterion: CriterionForm[],
  indicatorIndex: number
): Criterion[] {
  return criterion?.map((criterion: CriterionForm): Criterion => {
    return {
      indicatorIndex: indicatorIndex,
      subindex: criterion.subindex,
      englishName: criterion.englishName,
      spanishAlias: criterion.spanishAlias,
    };
  });
}
export function CriterionToCriteriaSubIndex(
  criterion: Criterion[]
): CriteriaSubIndex[] {
  return criterion?.map((criterion: Criterion): CriteriaSubIndex => {
    return {
      subindex: criterion.subindex,
    };
  });
}
@Component({
  selector: 'app-dialog-edit',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    DropdownModule,
    ConfirmPopupModule,
    ToastModule,
    MultiSelectModule,
    InputTextareaModule,
  ],
  templateUrl: './dialog-edit.component.html',
  styleUrl: './dialog-edit.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class DialogEditComponent {
  @Input() visible: boolean = false;
  @Input() category: CategoriesByIndicator = {
    name: '',
    helpText: '',
    criteria: [],
  };
  @Output() hideDialog: EventEmitter<void> = new EventEmitter();
  @Output() editCategory: EventEmitter<{
    category: CategoriesByIndicator;
    name: string;
  }> = new EventEmitter();
  @Output() deleteCategory: EventEmitter<{
    name: string;
  }> = new EventEmitter();
  @Input() criteria: Criterion[] = [];
  categoriesService = inject(CategoriesService);
  toastService = inject(ToastrService);
  visibleDelete = false;
  loading = false;
  deleteLoading = false;
  indicatorIndex = 0;

  constructor(
    private readonly route: ActivatedRoute,
    private confirmationService: ConfirmationService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.indicatorIndex = +params['index'];
    });
  }

  categoryForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    helpText: new FormControl('', [Validators.required]),
    criteria: new FormControl<Criterion[]>([], []),
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['category'] && changes['category'].currentValue) {
      this.categoryForm.setValue({
        name: changes['category'].currentValue.name,
        helpText: changes['category'].currentValue.helpText,
        criteria:
          CriterionFormToCriterion(
            changes['category'].currentValue.criteria,
            this.indicatorIndex
          ) ?? [],
      });
    }
  }

  hide() {
    this.hideDialog.emit();
    this.categoryForm.reset();
    this.category = { name: '', helpText: '', criteria: [] };
  }
  updateCategory() {
    if (this.categoryForm.valid) {
      this.loading = true;
      const category: CategoriesForm = {
        name: this.categoryForm.value.name as string,
        helpText: this.categoryForm.value.helpText as string,
        criteria: CriterionToCriteriaSubIndex(
          this.categoryForm.value.criteria as Criterion[]
        ),
      };
      this.categoriesService
        .updateCategory(this.indicatorIndex, this.category.name, category)
        .subscribe({
          next: (response) => {
            this.editCategory.emit({
              category: response.data,
              name: this.category.name,
            });
            this.toastService.success('Categoria actualizada con éxito');
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
  showDelete() {
    this.visibleDelete = true;
  }
  hideDelete() {
    this.visibleDelete = false;
  }
  confirmDelete() {
    this.deleteLoading = true;
    this.categoriesService
      .deleteCategory(this.indicatorIndex, this.category.name)
      .subscribe({
        next: (response) => {
          this.deleteCategory.emit({ name: this.category.name });
          this.toastService.success('Categoria eliminada con éxito');
          this.deleteLoading = false;
          this.hideDelete();
          this.hide();
        },
        error: (error: CustomHttpErrorResponse) => {
          this.toastService.error('Ha ocurrido un error inesperado');
          this.deleteLoading = false;
        },
      });
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
        this.showDelete();
      },
    });
  }
}
