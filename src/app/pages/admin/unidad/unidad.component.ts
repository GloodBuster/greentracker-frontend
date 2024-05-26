import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import * as data from '../../../../assets/unitsData.json';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DialogCreateComponent } from '../../../components/unidad/dialog-create/dialog-create.component';
import { DialogEditComponent } from '../../../components/unidad/dialog-edit/dialog-edit.component';


@Component({
  selector: 'app-unidad',
  standalone: true,
  imports: [SidebarComponent, ButtonModule, TableModule, CommonModule, TagModule, DialogModule, InputTextModule, FormsModule, FloatLabelModule, DialogCreateComponent, DialogEditComponent],
  templateUrl: './unidad.component.html',
  styleUrl: './unidad.component.scss'
})
export class UnidadComponent implements OnInit {
  unitsData: any = (data as any).default;
  visible: boolean = false;
  editingUnit: any;
  viewingUnit: any;
  visibleView: boolean = false;

  constructor() { }

  ngOnInit(): void {
    console.log(this.unitsData);
  }

  showDialog() {
    this.visible = true;
  }
  
  hideDialog() {
    this.visible = false;
  }

  visibleEdit: boolean = false;

showDialogEdit(unit: any) {
  this.editingUnit = unit;
  this.visibleEdit = true;
}

hideDialogEdit() {
  this.visibleEdit = false;
}

update(value: any) {
  const indexToUpdate = this.unitsData.findIndex((unit: any) => unit.id === value.id);
  this.unitsData[indexToUpdate] = value;

}

delete(unit: any) {
  const index = this.unitsData.findIndex((u: any) => u.id === unit.id);
  this.unitsData.splice(index, 1);
}

view(unit: any) {
  this.viewingUnit = unit;
  this.visibleView = true; 
}

hideDialogView() {
  this.visibleView = false;
}
}