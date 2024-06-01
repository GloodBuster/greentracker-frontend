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
import * as data from '../../../../assets/indicatorsData.json';
import { DialogCreateComponent } from '../../../components/indicador/dialog-create/dialog-create.component';
import { DialogEditComponent } from '../../../components/indicador/dialog-edit/dialog-edit.component';

@Component({
  selector: 'app-indicador',
  standalone: true,
  imports: [SidebarComponent, ButtonModule, TableModule, CommonModule, TagModule, DialogModule, InputTextModule, FormsModule, FloatLabelModule, DialogCreateComponent, DialogEditComponent],
  templateUrl: './indicador.component.html',
  styleUrl: './indicador.component.scss'
})
export class IndicadorComponent implements OnInit{
  indicatorsData: any = (data as any).default;
  visible: boolean = false;
  editingIndicator: any;

  constructor() { }

  ngOnInit(): void {
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
  }
  update(value: any) {
    const indexToUpdate = this.indicatorsData.findIndex((indicator: any) => indicator.id === value.id);
    this.indicatorsData[indexToUpdate] = value;
  }
  delete(indicador: any) {
    const index = this.indicatorsData.findIndex((i: any) => i.id === indicador.id);
    this.indicatorsData.splice(index, 1);
  }
}
