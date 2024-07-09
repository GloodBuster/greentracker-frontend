import { Component, Input, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DividerModule } from 'primeng/divider';
import { ImageModule } from 'primeng/image';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-evidence',
  standalone: true,
  imports: [DividerModule, TagModule, InputGroupModule, InputGroupAddonModule, InputTextModule, TooltipModule,ImageModule, CommonModule ],
  templateUrl: './image-evidence.component.html',
  styleUrl: './image-evidence.component.scss'
})
export class ImageEvidenceComponent {
  @Input() evidence: any;
  toastService = inject(ToastrService);
  selectedFeedback = '';
  imageSize: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const fullUrl = 'http://149.50.140.48' + this.evidence.link;
    this.getImageSize(fullUrl);
  }

  getImageSize(url: string) {
    this.http.head(url, { observe: 'response' }).subscribe(response => {
      this.imageSize = Number(response.headers.get('Content-Length'));
    });
  }
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
