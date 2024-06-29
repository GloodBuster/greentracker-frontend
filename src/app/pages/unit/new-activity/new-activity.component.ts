import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import {
  DocumentEvidence,
  getDocumentEvidenceForm,
  getImageEvidenceForm,
  getLinkEvidenceForm,
  ImageEvidence,
  LinkEvidence,
} from '../../../utils/formsTypes';
import { LinkEvidenceFormComponent } from '../../../components/unit/link-evidence-form/link-evidence-form.component';
import { ImageEvidenceFormComponent } from '../../../components/unit/image-evidence-form/image-evidence-form.component';
import { DocumentEvidenceFormComponent } from '../../../components/unit/document-evidence-form/document-evidence-form.component';

@Component({
  selector: 'app-new-activity',
  standalone: true,
  imports: [
    ButtonModule,
    OverlayPanelModule,
    ReactiveFormsModule,
    LinkEvidenceFormComponent,
    ImageEvidenceFormComponent,
    DocumentEvidenceFormComponent,
  ],
  templateUrl: './new-activity.component.html',
  styleUrl: './new-activity.component.scss',
})
export class NewActivityComponent {
  evidences: (ImageEvidence | LinkEvidence | DocumentEvidence)[] = [
    getImageEvidenceForm(),
  ];

  addImageEvidence() {
    this.evidences.push(getImageEvidenceForm());
  }

  addLinkEvidence() {
    this.evidences.push(getLinkEvidenceForm());
  }

  addDocumentEvidence() {
    this.evidences.push(getDocumentEvidenceForm());
  }

  removeEvidence(index: number) {
    this.evidences.splice(index, 1);
  }
}
