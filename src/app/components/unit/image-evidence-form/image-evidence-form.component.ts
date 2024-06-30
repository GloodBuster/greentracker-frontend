import { Component, EventEmitter, Input, Output } from '@angular/core';
import { getImageEvidenceForm, ImageEvidence } from '../../../utils/formsTypes';
import { ReactiveFormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { formatFileSize } from '../../../utils/files';
import { animate, style, transition, trigger } from '@angular/animations';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

export interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'image-evidence-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TagModule,
    InputTextModule,
    InputTextareaModule,
    FileUploadModule,
    DialogModule,
    ButtonModule,
  ],
  templateUrl: './image-evidence-form.component.html',
  styleUrl: './image-evidence-form.component.scss',
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
export class ImageEvidenceFormComponent {
  @Input() imageForm: ImageEvidence = getImageEvidenceForm();
  @Output() removeEvidence: EventEmitter<void> = new EventEmitter<void>();
  visibleDelete = false;
  file: File | null = null;
  objectURL: string | null = null;

  createObjectURL() {
    if (this.file) {
      this.objectURL = URL.createObjectURL(this.file);
    }
  }

  revokeObjectURL() {
    if (this.objectURL) {
      URL.revokeObjectURL(this.objectURL);
      this.objectURL = null;
    }
  }

  remove() {
    this.removeEvidence.emit();
  }

  onUpload(event: UploadEvent) {
    if (event.files && event.files[0]) {
      this.revokeObjectURL(); // Clean up any existing object URL
      this.file = event.files[0];
      this.imageForm.controls.file.setValue(this.file);
      this.createObjectURL(); // Create a new object URL for the uploaded file
    }
  }

  removeFile() {
    this.revokeObjectURL();
    this.file = null;
    this.imageForm.controls.file.setValue(null);
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
