import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
  selector: 'app-new-activity',
  standalone: true,
  imports: [ButtonModule, OverlayPanelModule],
  templateUrl: './new-activity.component.html',
  styleUrl: './new-activity.component.scss',
})
export class NewActivityComponent {
  print() {
    console.log('Funcionando');
  }
}
