import { Component, EventEmitter, Input, Output } from '@angular/core';
import { getLinkEvidenceForm, LinkEvidence } from '../../../utils/formsTypes';
import { ReactiveFormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { animate, style, transition, trigger } from '@angular/animations';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'link-evidence-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TagModule,
    InputTextModule,
    InputTextareaModule,
    DialogModule,
    ButtonModule,
  ],
  templateUrl: './link-evidence-form.component.html',
  styleUrl: './link-evidence-form.component.scss',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(+100%)' }),
        animate('800ms ease-in-out', style({ transform: 'translateY(0%)' })),
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0%)' }),
        animate('800ms ease-in-out', style({ transform: 'translateY(-100%)' })),
      ]),
    ]),
  ],
})
export class LinkEvidenceFormComponent {
  @Input() linkForm: LinkEvidence = getLinkEvidenceForm();
  @Output() removeEvidence: EventEmitter<void> = new EventEmitter<void>();
  visibleDelete = false;

  remove() {
    this.removeEvidence.emit();
  }

  showDelete() {
    this.visibleDelete = true;
  }

  hideDelete() {
    this.visibleDelete = false;
  }
}
