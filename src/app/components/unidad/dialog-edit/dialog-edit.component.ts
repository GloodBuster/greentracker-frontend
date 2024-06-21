import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { Units, UnitsForm, UnitsGet } from '../../../interfaces/units/units';
import { UnitsService } from '../../../services/units/units.service';
import { CustomHttpErrorResponse } from '../../../interfaces/responses/error';

@Component({
  selector: 'app-dialog-edit',
  standalone: true,
  imports: [ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule, FormsModule, FloatLabelModule, PanelModule, MultiSelectModule, CommonModule],
  templateUrl: './dialog-edit.component.html',
  styleUrl: './dialog-edit.component.scss'
})
export class DialogEditComponent implements OnChanges {
  @Input() unit: UnitsGet = { id: '', name: '', email: '', recommendedCategories: []};
  @Input() visible: boolean = false;
  @Output() hide: EventEmitter<any> = new EventEmitter();
  @Output() update: EventEmitter<any> = new EventEmitter<any>();
  @Output() delete: EventEmitter<any> = new EventEmitter<any>();
  loading = false;
  deleteLoading = false;

  categoriesData = categoriesData;
  

  constructor(private unitsService: UnitsService) {

  }
  showConfirmDialog = false;

  unitsForm = new FormGroup({
    name: new FormControl(this.unit.name, [Validators.required]),
    email: new FormControl(this.unit.email, [Validators.required, Validators.email]),
  });

  toastService = inject(ToastrService);

  /*categorias: { id: number; name: string; }[] = [];*/

  hideDialogEdit() {
    this.unitsForm.reset();
    this.unit = { id: '', name: '', email: '', recommendedCategories: []};
    this.hide.emit();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['unit'] && changes['unit'].currentValue) {
      this.unitsForm.setValue({
        name: changes['unit'].currentValue.name,
        email: changes['unit'].currentValue.email,
      });
    }
  }

  submitForm() {
    if(this.unitsForm.valid){
      const unit: UnitsGet = {
        id: this.unit.id ?? '',
        name: this.unitsForm.value.name ?? '',
        email: this.unitsForm.value.email ?? '',
        recommendedCategories: this.unit.recommendedCategories
      };

      this.unitsService.updateUnit(this.unit.id, unit).subscribe(
        {
          next:(response) => {
          this.update.emit({value: unit, id: this.unit.id});
          this.toastService.success('Unidad actualizada con éxito');
          this.hideDialogEdit();
        },
        error: (error: CustomHttpErrorResponse) => {
          this.toastService.error('Error al actualizar la unidad');
          console.error('Error al actualizar la unidad:', error);
        }
      });
      }
  }

  deleteUnit(){
    if(this.unitsForm.valid){
      this.showConfirmDialog = true;
    } else{
      this.toastService.error('Ha ocurrido un error');
      console.log('Formulario no válido');
    }
  }

  confirmDelete() {
const id = this.unit.id;
this.unitsService.deleteUnit(id).subscribe({
  next: (response) => {
    this.delete.emit(id);
    this.hideDialogEdit();
    this.toastService.success('Unidad eliminada con éxito');
    this.showConfirmDialog = false;
  },
  error: (error: CustomHttpErrorResponse) => {
    this.toastService.error('Ha ocurrido un error inesperado');
    console.error('Error al eliminar la unidad:', error);
  }}
);
  }

  cancelDelete() {
    this.showConfirmDialog = false;
  }
}
