import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-edit',
  standalone: true,
  imports: [ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule, FormsModule, FloatLabelModule, PanelModule, CommonModule],
  templateUrl: './dialog-edit.component.html',
  styleUrl: './dialog-edit.component.scss'
})
export class DialogEditComponent {
  @Input() indicador: any;
  @Input() visible: boolean = false;
  @Output() hide: EventEmitter<any> = new EventEmitter();
  @Output() update: EventEmitter<any> = new EventEmitter<any>();
  @Output() delete: EventEmitter<any> = new EventEmitter<any>();

  showConfirmDialog = false;

  indicadorForm = new FormGroup({
    id: new FormControl(0),
    name: new FormControl(''),
    SpanishAlias: new FormControl(''),
  });

  toastService = inject(ToastrService);

  hideDialogEdit() {
    this.hide.emit();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['indicador'] && changes['indicador'].currentValue) {
      this.indicadorForm.setValue({
        id: changes['indicador'].currentValue.id,
        name: changes['indicador'].currentValue.name,
        SpanishAlias: changes['indicador'].currentValue.SpanishAlias,
      });
    }
  }
  submitForm() {
    if (this.indicadorForm.valid) {
      this.update.emit(this.indicadorForm.value);
      this.hideDialogEdit();
      this.toastService.success('Indicador editado con éxito');
    } else {
      this.toastService.error('Ha ocurrido un error');
      console.log('Formulario no válido');
    }
  }
}
