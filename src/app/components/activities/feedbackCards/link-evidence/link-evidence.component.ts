import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-link-evidence',
  standalone: true,
  imports: [DividerModule, TagModule, InputGroupModule, InputGroupAddonModule, InputTextModule ],
  templateUrl: './link-evidence.component.html',
  styleUrl: './link-evidence.component.scss'
})
export class LinkEvidenceComponent {

}
