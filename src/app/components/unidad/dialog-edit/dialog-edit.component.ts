import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { ToastrService } from 'ngx-toastr';
import { MultiSelectModule } from 'primeng/multiselect';
import categoriesData from '../../../../assets/categories.json';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-edit',
  standalone: true,
  imports: [ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule, FormsModule, FloatLabelModule, PanelModule, MultiSelectModule, CommonModule],
  templateUrl: './dialog-edit.component.html',
  styleUrl: './dialog-edit.component.scss'
})
export class DialogEditComponent implements OnChanges {
  @Input() unit: any;
  @Input() visible: boolean = false;
  @Output() hide: EventEmitter<any> = new EventEmitter();
  @Output() update: EventEmitter<any> = new EventEmitter<any>();
  @Output() delete: EventEmitter<any> = new EventEmitter<any>();

  categoriesData = categoriesData;
  showConfirmDialog = false;

  unitForm = new FormGroup({
    id: new FormControl(0),
    nombre: new FormControl(''),
    correo: new FormControl(''),
    categorias: new FormControl([])
  });

  toastService = inject(ToastrService);

  hideDialogEdit() {
    this.hide.emit();
  }

  categorias: { id: number; name: string; }[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['unit'] && changes['unit'].currentValue) {
      this.unitForm.setValue({
        id: changes['unit'].currentValue.id,
        nombre: changes['unit'].currentValue.nombre,
        correo: changes['unit'].currentValue.correo,
        categorias: changes['unit'].currentValue.categorias,
      });
      console.log(categoriesData)
      console.log(changes['unit'].currentValue.categorias);
    }
  }

  submitForm() {
    if (this.unitForm.valid) {
      console.log(this.unitForm.value);
      this.update.emit(this.unitForm.value);
      this.hideDialogEdit();
      this.toastService.success('Unidad editada con éxito');
    } else {
      this.toastService.error('Ha ocurrido un error');
      console.log('Formulario no válido');
    }
  }


  deleteUnit() {
    if (this.unitForm.valid) {
      this.showConfirmDialog = true;
    } else {
      this.toastService.error('Ha ocurrido un error');
      console.log('Formulario no válido');
    }
  }

  confirmDelete() {
    this.delete.emit(this.unitForm.value);
    this.hideDialogEdit();
    this.toastService.success('Unidad eliminada con éxito');
    this.showConfirmDialog = false;
  }

  cancelDelete() {
    this.showConfirmDialog = false;
  }

}
