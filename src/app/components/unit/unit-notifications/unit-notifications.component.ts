import { Component, Input } from '@angular/core';
import { Activity } from '../../../interfaces/activities/activities';
import { CommonModule } from '@angular/common';
import { ImageModule } from 'primeng/image';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-unit-notifications',
  standalone: true,
  imports: [CommonModule, ImageModule, DividerModule],
  templateUrl: './unit-notifications.component.html',
  styleUrl: './unit-notifications.component.scss'
})
export class UnitNotificationsComponent {
  @Input() notifications!: Activity[];

  constructor() {
  }
}
