import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { UnitSidebarComponent } from '../unit-sidebar/unit-sidebar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-unit-layout',
  standalone: true,
  imports: [NavbarComponent, UnitSidebarComponent, RouterOutlet],
  templateUrl: './unit-layout.component.html',
  styleUrl: './unit-layout.component.scss',
})
export class UnitLayoutComponent {}
