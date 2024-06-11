import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-evidence-matrix',
  standalone: true,
  imports: [TableModule],
  templateUrl: './evidence-matrix.component.html',
  styleUrl: './evidence-matrix.component.scss'
})
export class EvidenceMatrixComponent {

}
