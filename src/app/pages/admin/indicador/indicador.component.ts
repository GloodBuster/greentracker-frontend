import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DialogCreateComponent } from '../../../components/indicador/dialog-create/dialog-create.component';
import { DialogEditComponent } from '../../../components/indicador/dialog-edit/dialog-edit.component';
import { IndicatorService } from '../../../services/indicator/indicator.service';
import { Indicator } from '../../../interfaces/indicator/indicator';
import { CustomHttpErrorResponse } from '../../../interfaces/responses/error';

@Component({
  selector: 'app-indicador',
  standalone: true,
  imports: [SidebarComponent, ButtonModule, TableModule, CommonModule, TagModule, DialogModule, InputTextModule, FormsModule, FloatLabelModule, DialogCreateComponent, DialogEditComponent],
  templateUrl: './indicador.component.html',
  styleUrl: './indicador.component.scss'
})
export class IndicadorComponent {
  indicatorsData: Indicator[] = [];
  visible: boolean = false;
  editingIndicator: any;

  constructor(private readonly indicatorService: IndicatorService) { 
    this.indicatorService.getIndicators().subscribe({
      next: (response) => {
        this.indicatorsData = response.data.items;
      },
      error: (error: CustomHttpErrorResponse) => {
        console.error(error);
      }
    })
  }
  
  showDialog() {
    this.visible = true;
  }
  hideDialog() {
    this.visible = false;
  }
  create(indicator: any) {
    this.indicatorsData.push(indicator);
  }
  visibleEdit: boolean = false;

  showDialogEdit(indicator: any) {
    this.editingIndicator = indicator;
    this.visibleEdit = true;
  }
  
  hideDialogEdit() {
    this.visibleEdit = false;
    this.editingIndicator = {index: 0, englishName: '', spanishAlias: ''};
  }

  update({value,index}: { value: Indicator, index: number }) {
    const indexToUpdate = this.indicatorsData.findIndex((indicator) => indicator.index === index);
    this.indicatorsData[indexToUpdate] = value;
  }
  delete(index: number) {
    const indexDelete = this.indicatorsData.findIndex((i) => i.index === index);
    this.indicatorsData.splice(indexDelete, 1);
  }
}
