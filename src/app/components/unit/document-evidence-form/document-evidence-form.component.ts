import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  DocumentEvidence,
  getDocumentEvidenceForm,
} from '../../../utils/formsTypes';

@Component({
  selector: 'document-evidence-form',
  standalone: true,
  imports: [],
  templateUrl: './document-evidence-form.component.html',
  styleUrl: './document-evidence-form.component.scss',
})
export class DocumentEvidenceFormComponent {
  @Input() documentForm: DocumentEvidence = getDocumentEvidenceForm();
  @Output() removeEvidence: EventEmitter<void> = new EventEmitter<void>();

  remove() {
    this.removeEvidence.emit();
  }
}
