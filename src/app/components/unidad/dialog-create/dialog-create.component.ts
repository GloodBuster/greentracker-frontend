import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
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

@Component({
  selector: 'app-dialog-create',
  standalone: true,
  imports: [DialogModule, InputTextModule, FormsModule, FloatLabelModule, ButtonModule, PanelModule, ReactiveFormsModule, MultiSelectModule],
  templateUrl: './dialog-create.component.html',
  styleUrl: './dialog-create.component.scss'
})
export class DialogCreateComponent {
@Input() visible: boolean = false;
@Output() hide: EventEmitter<any> = new EventEmitter();

category: any[] | undefined;

    selectedCategory: string | undefined;
    selectedCategories: any[] = [];
    ngOnInit() {
        this.category = [
            {id: 1, name: 'Categoría1' },
            {id: 2, name: 'Categoría2' },
            {id: 3, name: 'Categoría3' },
            {id: 4, name: 'Categoría4' },
            {id: 5, name: 'Categoría5' },
            {id: 6, name: 'Categoría6' },
            {id: 7, name: 'Categoría7' },
            {id: 8, name: 'Categoría8' },
            {id: 9, name: 'Categoría9' },
            {id: 10, name: 'Categoría10' }
        ];
    }

hideDialog() {
  this.hide.emit();
}
toastService = inject(ToastrService);

unitForm = new FormGroup({
  nombre: new FormControl('', [Validators.required]),
  correo: new FormControl('', [Validators.required, Validators.email]),
  selectedCategories: new FormControl([])
});

submitForm() {
  if (this.unitForm.valid) {
    console.log(this.unitForm.value);
    this.hideDialog();
    this.toastService.success('Unidad creada con éxito');
    this.unitForm.reset();
  } else {
    this.toastService.error('Ha ocurrido un error');
    console.log('Formulario no válido');
  }
}
}

