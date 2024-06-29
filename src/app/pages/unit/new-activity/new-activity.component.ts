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
  evidences: (ImageEvidence | LinkEvidence | DocumentEvidence)[] = [];

  addImageEvidence() {
    this.evidences.push(getImageEvidenceForm());
    this.scrollToTop();
  }

  addLinkEvidence() {
    this.evidences.push(getLinkEvidenceForm());
    this.scrollToTop();
  }

  addDocumentEvidence() {
    this.evidences.push(getDocumentEvidenceForm());
    this.scrollToTop();
  }

  removeEvidence(index: number) {
    this.evidences = [
      ...this.evidences.slice(0, index),
      ...this.evidences.slice(index + 1),
    ];
  }

  scrollToTop() {
    setTimeout(() => {
      const topElement = document.getElementById('topOfPage');
      const lastChild = topElement?.lastElementChild;
      if (lastChild) {
        lastChild.scrollIntoView({ behavior: 'smooth' });
        console.log('Subiendo');
      }
    }, 0);
  }
}
