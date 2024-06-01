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
import categoriasData from '../../../../assets/categories.json'

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
@Output() create: EventEmitter<any> = new EventEmitter<any>();

category: any[] | undefined;

    selectedCategory: string | undefined;
    categorias: any[] = [];
    ngOnInit() {
      this.category = categoriasData;
    }

hideDialog() {
  this.hide.emit();
}
toastService = inject(ToastrService);

unitForm = new FormGroup({
  id: new FormControl(9),
  nombre: new FormControl('', [Validators.required]),
  correo: new FormControl('', [Validators.required, Validators.email]),
  categorias: new FormControl([])
});

submitForm() {
  if (this.unitForm.valid) {
    console.log(this.unitForm.value);
    this.create.emit(this.unitForm.value);
    this.hideDialog();
    this.toastService.success('Unidad creada con éxito');
  } else {
    this.toastService.error('Ha ocurrido un error');
    console.log('Formulario no válido');
  }
}

}

