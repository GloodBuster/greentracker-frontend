import { Component, Input } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-document-evidence',
  standalone: true,
  imports: [DividerModule, TagModule, InputGroupModule, InputGroupAddonModule, InputTextModule ],
  templateUrl: './document-evidence.component.html',
  styleUrl: './document-evidence.component.scss'
})
export class DocumentEvidenceComponent {
  @Input() evidence: any;
  selectedFeedback = '';

  selectFeedback(icon: string) {
    this.selectedFeedback = icon;
  }
}
