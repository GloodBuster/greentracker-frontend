import { Component, Input, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DividerModule } from 'primeng/divider';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-image-evidence',
  standalone: true,
  imports: [DividerModule, TagModule, InputGroupModule, InputGroupAddonModule, InputTextModule, TooltipModule ],
  templateUrl: './image-evidence.component.html',
  styleUrl: './image-evidence.component.scss'
})
export class ImageEvidenceComponent {
  @Input() evidence: any;
  toastService = inject(ToastrService);
  selectedFeedback = '';

  async copyValue(inputValue: HTMLInputElement) {
    try {
      await navigator.clipboard.writeText(inputValue.value);
      this.toastService.success('Copiado al portapapeles');
    } catch (err) {
      console.error('Error al copiar al portapapeles', err);
    }
  }
  selectFeedback(icon: string) {
    this.selectedFeedback = icon;
  }

}
