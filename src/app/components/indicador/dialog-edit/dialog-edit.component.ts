import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { IndicatorService } from '../../../services/indicator/indicator.service';
import { Indicator } from '../../../interfaces/indicator/indicator';
import { ErrorResponse } from '../../../interfaces/responses/error';

@Component({
  selector: 'app-dialog-edit',
  standalone: true,
  imports: [ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule, FormsModule, FloatLabelModule, PanelModule, CommonModule],
  templateUrl: './dialog-edit.component.html',
  styleUrl: './dialog-edit.component.scss'
})
export class DialogEditComponent {
  @Input() indicador: Indicator = {index: 0, englishName: '', spanishAlias: ''};
  @Input() visible: boolean = false;
  @Output() hide: EventEmitter<any> = new EventEmitter();
  @Output() update: EventEmitter<{value: Indicator, index: number}> = new EventEmitter<any>();
  @Output() delete: EventEmitter<any> = new EventEmitter<any>();

  constructor(private indicatorService: IndicatorService) {

   }

  showConfirmDialog = false;

  indicadorForm = new FormGroup({
    index: new FormControl(this.indicador.index, [Validators.required]),
    englishName: new FormControl(this.indicador.englishName, [Validators.required]),
    spanishAlias: new FormControl(this.indicador.spanishAlias, [Validators.required]),
  });

  toastService = inject(ToastrService);

  hideDialogEdit() {
    this.indicadorForm.reset();
    this.indicador = {index: 0, englishName: '', spanishAlias: ''};
    this.hide.emit();
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['indicador'] && changes['indicador'].currentValue) {
      this.indicadorForm.setValue({
        index: changes['indicador'].currentValue.index,
        englishName: changes['indicador'].currentValue.englishName,
        spanishAlias: changes['indicador'].currentValue.spanishAlias,
      });
    }
  }

  submitForm() {
    if (this.indicadorForm.valid) {
      const indicator: Indicator = {
        index: this.indicadorForm.value.index ?? 0, 
        englishName: this.indicadorForm.value.englishName ?? '', 
        spanishAlias: this.indicadorForm.value.spanishAlias ?? '', 
      };
    
      this.indicatorService.editIndicator(indicator).subscribe(
        {
          next:(response) => {
          this.update.emit({value: indicator, index: this.indicador.index});
          this.hideDialogEdit();
          this.toastService.success('Indicador editado con éxito');
          this.indicadorForm.reset(); 
        },
        error: (error: ErrorResponse) => {
          this.toastService.error(error.message);
        }}
      );
    } else {
      this.toastService.error('Ha ocurrido un error');
    }
  }

  deleteIndicador() {
    if (this.indicadorForm.valid) {
      this.showConfirmDialog = true;
    } else {
      this.toastService.error('Ha ocurrido un error');
    }
  }

  confirmDelete() {
    const index = this.indicador.index;
      this.indicatorService.deleteIndicator(index).subscribe({
        next: (response) => {
          this.delete.emit(index); 
          this.hideDialogEdit();
          this.toastService.success('Indicador eliminado con éxito');
          this.showConfirmDialog = false;
        },
        error: (error: ErrorResponse) => {
          this.toastService.error(error.message);
        }}
      );
  }

  cancelDelete() {
    this.showConfirmDialog = false;
  }
}
