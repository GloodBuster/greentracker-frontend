import { Component, EventEmitter, Input, Output } from '@angular/core';
import { getImageEvidenceForm, ImageEvidence } from '../../../utils/formsTypes';
import { ReactiveFormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { formatFileSize } from '../../../utils/files';

interface UploadEvent {
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
  ],
  templateUrl: './image-evidence-form.component.html',
  styleUrl: './image-evidence-form.component.scss',
})
export class ImageEvidenceFormComponent {
  @Input() imageForm: ImageEvidence = getImageEvidenceForm();
  @Output() removeEvidence: EventEmitter<void> = new EventEmitter<void>();
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
      this.createObjectURL(); // Create a new object URL for the uploaded file
    }
  }

  removeFile() {
    this.revokeObjectURL();
    this.file = null;
  }

  choose(event: Event, callback: any) {
    callback();
  }

  formatFileSize = formatFileSize;
}
