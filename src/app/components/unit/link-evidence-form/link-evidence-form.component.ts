import { Component, EventEmitter, Input, Output } from '@angular/core';
import { getLinkEvidenceForm, LinkEvidence } from '../../../utils/formsTypes';
import { ReactiveFormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  selector: 'link-evidence-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TagModule,
    InputTextModule,
    InputTextareaModule,
  ],
  templateUrl: './link-evidence-form.component.html',
  styleUrl: './link-evidence-form.component.scss',
})
export class LinkEvidenceFormComponent {
  @Input() linkForm: LinkEvidence = getLinkEvidenceForm();
  @Output() removeEvidence: EventEmitter<void> = new EventEmitter<void>();

  remove() {
    this.removeEvidence.emit();
  }
}
