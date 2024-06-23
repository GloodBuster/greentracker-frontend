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
  ],
  templateUrl: './dialog-edit.component.html',
  styleUrl: './dialog-edit.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class DialogEditComponent {
  @Input() visible: boolean = false;
  @Input() category: CategoriesByIndicator = {
    indicatorIndex: 0,
    name: '',
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
  });}

  categoryForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    criteria: new FormControl<Criterion[]>([], []),
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['category'] && changes['category'].currentValue) {
      console.log(this.category);
      this.categoryForm.setValue({
        name: changes['category'].currentValue.name,
        criteria:
          CriterionFormToCriterion(changes['category'].currentValue.criteria, this.indicatorIndex) ?? [],
      });
    }
  }

  hide() {
    this.hideDialog.emit();
    this.categoryForm.reset();
    this.category = { indicatorIndex: 0, name: '', criteria: [] };
  }
  updateCategory() {
    if (this.categoryForm.valid) {
      this.loading = true;
      const category: CategoriesForm = this.categoryForm
        .value as CategoriesForm;
      this.categoriesService
        .updateCategory(
          this.category.indicatorIndex,
          this.category.name,
          category
        )
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
            this.toastService.error('Ha ocurrido un error inesperado');
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
      .deleteCategory(this.category.indicatorIndex, this.category.name)
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
