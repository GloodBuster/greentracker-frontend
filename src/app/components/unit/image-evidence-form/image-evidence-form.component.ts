import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
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
import { ImageModule } from 'primeng/image';
import { EvidenceWithFeedback } from '../../../interfaces/evidences/evidences';

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
    ImageModule,
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
export class ImageEvidenceFormComponent implements OnChanges {
  @Input() imageForm: ImageEvidence = getImageEvidenceForm();
  @Input() evidenceWithFeedback?: EvidenceWithFeedback;
  @Output() removeEvidence: EventEmitter<void> = new EventEmitter<void>();
  visibleDelete = false;
  file: File | null = null;
  objectURL: string | null = null;
  limitFileSize = 10 * 1024 * 1024;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['imageForm'] && changes['imageForm'].currentValue) {
      const file = changes['imageForm'].currentValue.value.file ?? null;
      this.uploadInput(file);
    }
  }

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
    if (
      event.files &&
      event.files[0] &&
      event.files[0].size <= this.limitFileSize
    ) {
      this.revokeObjectURL(); // Clean up any existing object URL
      this.file = event.files[0];
      this.imageForm.controls.file.setValue(this.file);
      this.createObjectURL(); // Create a new object URL for the uploaded file
    }
  }

  uploadInput(file?: File) {
    if (file) {
      this.revokeObjectURL(); // Clean up any existing object URL
      this.file = file;
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

  thereAreFeedbackType(feedbackType: string) {
    return (
      this.evidenceWithFeedback?.feedbacks.some(
        (feedback) => feedback.feedback === feedbackType
      ) ?? false
    );
  }

  formatFileSize = formatFileSize;
}
