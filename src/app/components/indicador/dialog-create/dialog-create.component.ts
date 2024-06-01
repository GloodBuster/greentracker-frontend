import { Component, EventEmitter, Input, Output, inject  } from '@angular/core';
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

@Component({
  selector: 'app-dialog-create',
  standalone: true,
  imports: [DialogModule, InputTextModule, FormsModule, FloatLabelModule, ButtonModule, PanelModule, ReactiveFormsModule],
  templateUrl: './dialog-create.component.html',
  styleUrl: './dialog-create.component.scss'
})
export class DialogCreateComponent {
  @Input() visible: boolean = false;
  @Output() hide: EventEmitter<any> = new EventEmitter();
  @Output() create: EventEmitter<any> = new EventEmitter<any>();

  hideDialog() {
    this.hide.emit();
  }
  toastService = inject(ToastrService);
  indicatorForm = new FormGroup({
    id: new FormControl(12),
    name: new FormControl('', [Validators.required]),
    SpanishAlias: new FormControl('', [Validators.required]),
  });

  submitForm() {
    if (this.indicatorForm.valid) {
      console.log(this.indicatorForm.value);
      this.create.emit(this.indicatorForm.value);
      this.hideDialog();
      this.toastService.success('Indicador creado con éxito');
    } else {
      this.toastService.error('Ha ocurrido un error');
      console.log('Formulario no válido');
    }
  }
}
