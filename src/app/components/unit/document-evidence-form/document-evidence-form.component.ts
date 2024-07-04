import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  DocumentEvidence,
  getDocumentEvidenceForm,
} from '../../../utils/formsTypes';
import { ReactiveFormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { formatFileSize } from '../../../utils/files';
import { UploadEvent } from '../image-evidence-form/image-evidence-form.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'document-evidence-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TagModule,
    InputTextareaModule,
    FileUploadModule,
    ButtonModule,
    DialogModule,
  ],
  templateUrl: './document-evidence-form.component.html',
  styleUrl: './document-evidence-form.component.scss',
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
export class DocumentEvidenceFormComponent implements OnChanges {
  @Input() documentForm: DocumentEvidence = getDocumentEvidenceForm();
  @Input() feedback?: any[];
  @Output() removeEvidence: EventEmitter<void> = new EventEmitter<void>();
  visibleDelete = false;
  file: File | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['documentForm'] && changes['documentForm'].currentValue) {
      const file = changes['documentForm'].currentValue.value.file ?? null;
      this.uploadInput(file);
    }
  }

  remove() {
    this.removeEvidence.emit();
  }

  onUpload(event: UploadEvent) {
    if (event.files && event.files[0]) {
      this.file = event.files[0];
      this.documentForm.controls.file.setValue(this.file);
    }
  }

  uploadInput(file?: File) {
    if (file) {
      this.file = file;
      this.documentForm.controls.file.setValue(this.file);
    }
  }

  removeFile() {
    this.file = null;
    this.documentForm.controls.file.setValue(null);
  }

  choose(event: Event, callback: any) {
    callback();
  }

  showDelete() {
    this.visibleDelete = true;
  }

  hideDelete() {
    this.visibleDelete = false;
  }

  formatFileSize = formatFileSize;
}
