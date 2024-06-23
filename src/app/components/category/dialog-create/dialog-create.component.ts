import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
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
import { CategoriesForm } from '../../../interfaces/categories/categories';
import { CategoriesService } from '../../../services/categories/categories.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { CustomHttpErrorResponse } from '../../../interfaces/responses/error';
import { Criterion } from '../../../interfaces/criteria/criteria';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-dialog-create',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    DropdownModule,
    MultiSelectModule
  ],
  templateUrl: './dialog-create.component.html',
  styleUrl: './dialog-create.component.scss',
})
export class DialogCreateComponent implements OnInit {
  @Input() visible: boolean = false;
  @Output() hideDialog: EventEmitter<void> = new EventEmitter();
  @Output() createCategory: EventEmitter<any> = new EventEmitter();
  @Input() criteria: Criterion[] = [];
  categoryService = inject(CategoriesService);
  toastService = inject(ToastrService);
  indicatorIndex = 0;
  loading = false;

  constructor(private readonly route: ActivatedRoute) {}
  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const indicatorIndex = params.get('index');
      if (indicatorIndex) this.indicatorIndex = parseInt(indicatorIndex);
    });
  }

  categoryForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    criteria: new FormControl<Criterion[]>([], []),
  });

  hide() {
    this.hideDialog.emit();
    this.categoryForm.reset();
  }

  submitForm() {
    if (this.categoryForm.valid) {
      this.loading = true;
      const category = this.categoryForm.value as CategoriesForm;
      this.categoryService
        .createCategory(this.indicatorIndex, category)
        .subscribe({
          next: (response) => {
            this.createCategory.emit(response.data);
            this.toastService.success('Categoria agregada con éxito');
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
}
