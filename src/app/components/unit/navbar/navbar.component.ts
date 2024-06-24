import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { NotificationsListComponent } from '../../admin/notifications-list/notifications-list.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ImageModule, ButtonModule, OverlayPanelModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {}
