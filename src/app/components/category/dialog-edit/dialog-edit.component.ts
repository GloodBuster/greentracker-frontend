import { Component, EventEmitter, Input, Output, SimpleChanges, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { CategoriesForm, initialCategoriesForm } from '../../../interfaces/categories/categories';
import { CategoriesService } from '../../../services/categories/categories.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { CustomHttpErrorResponse } from '../../../interfaces/responses/error';

@Component({
  selector: 'app-dialog-edit',
  standalone: true,
  imports: [DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    DropdownModule,],
  templateUrl: './dialog-edit.component.html',
  styleUrl: './dialog-edit.component.scss'
})
export class DialogEditComponent {
  @Input() visible: boolean = false;
  @Input() category: CategoriesForm = initialCategoriesForm;
  @Output() hideDialog: EventEmitter<void> = new EventEmitter();
  @Output() editCategory: EventEmitter<{
    category: CategoriesForm;
    name: string;
  }> = new EventEmitter();
  @Output() deleteCategory: EventEmitter<{
    name: string;
  }> = new EventEmitter();
  indicatorIndex = 0;
  categoriesService = inject(CategoriesService);
  toastService = inject(ToastrService);
  visibleDelete = false;
  loading = false;
  deleteLoading = false;

  constructor(private readonly route: ActivatedRoute) {
    const indicatorIndex = this.route.snapshot.paramMap.get('indicatorIndex');
    if (indicatorIndex) this.indicatorIndex = parseInt(indicatorIndex);
  }

  categoryForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  ngOnChanges(changes: SimpleChanges){
    if(changes['category'] && changes['category'].currentValue){
      this.categoryForm.setValue({
        name: changes['category'].currentValue.name
      })
    }
  }

  hide(){
    this.hideDialog.emit();
    this.categoryForm.reset();
    this.category = initialCategoriesForm;
  }
  updateCategory(){
    if(this.categoryForm.valid){
      this.loading = true;
      const category: CategoriesForm = this.categoryForm.value as CategoriesForm;
      this.categoriesService
      .updateCategory(this.indicatorIndex,this.category.name, category)
      .subscribe({
        next: (response) => {
          this.editCategory.emit({category: response.data, name: this.category.name});
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
    showDelete(){
      this.visibleDelete = true;
    }
    hideDelete(){
      this.visibleDelete = false;
    }
    confirmDelete(){
      this.deleteLoading = true;
      this.categoriesService
      .deleteCategory(this.indicatorIndex, this.category.name)
      .subscribe({
        next: (response) => {
          this.deleteCategory.emit({name: this.category.name});
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
}

