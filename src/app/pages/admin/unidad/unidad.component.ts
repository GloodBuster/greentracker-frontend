import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import * as data from '../../../../assets/unitsData.json';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';


@Component({
  selector: 'app-unidad',
  standalone: true,
  imports: [SidebarComponent, ButtonModule, TableModule, CommonModule, TagModule],
  templateUrl: './unidad.component.html',
  styleUrl: './unidad.component.scss'
})
export class UnidadComponent implements OnInit {
  unitsData: any = (data as any).default;

  constructor() { }

  ngOnInit(): void {
  }

}