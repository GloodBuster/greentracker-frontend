import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [NavbarComponent, AdminSidebarComponent, RouterOutlet],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent {}
