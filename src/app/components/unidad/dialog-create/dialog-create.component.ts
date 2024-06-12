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
import { UnitsService } from '../../../services/units/units.service';
import { UnitsForm } from '../../../interfaces/units/units';
import { CustomHttpErrorResponse } from '../../../interfaces/responses/error';

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
loading = false;

constructor(private unitsService: UnitsService) { }

hideDialog() {
  this.hide.emit();
  this.unitsForm.reset();
}
toastService = inject(ToastrService);
unitsForm = new FormGroup({
  name: new FormControl('', [Validators.required]),
  email: new FormControl('', [Validators.required, Validators.email]),
  password: new FormControl('', [Validators.required]),
});

submitForm() {
  if(this.unitsForm.valid){
    this.loading = true;
    const unit = this.unitsForm.value as UnitsForm;
    this.unitsService
    .addNewUnit(unit)
    .subscribe({
      next: (response) => {
        this.create.emit(response.data);
        this.toastService.success('Unidad agregada con éxito');
        this.loading = false;
        this.hideDialog();
      },
      error: (error: CustomHttpErrorResponse) => {
        this.toastService.error('Error al agregar la unidad');
        console.error('Error al agregar la unidad:', error);
      }
    });
  }
}

/*category: any[] | undefined;

    selectedCategory: string | undefined;
    categorias: any[] = [];
    ngOnInit() {
      this.category = categoriasData;
    }




unitForm = new FormGroup({
  id: new FormControl(9),
  nombre: new FormControl('', [Validators.required]),
  correo: new FormControl('', [Validators.required, Validators.email]),
  categorias: new FormControl([])
});*/


}

