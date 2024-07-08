import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import {
  PaginatedResponse,
  Response,
} from '../../interfaces/responses/response';
import {
  DocumentEvidence,
  ImageEvidence,
  LinkEvidence,
} from '../../utils/formsTypes';
import {
  parseDocumentEvidence,
  parseImageEvidence,
} from '../../utils/evidencesFormData';
import {
  DocumentEvidenceI,
  ImageEvidenceI,
} from '../../interfaces/evidences/evidences';

@Injectable({
  providedIn: 'root',
})
export class EvidencesService {
  readonly http = inject(HttpClient);
  private readonly BASE_URL = environment.BASE_URL;

  createImageEvidence(
    activityId: string,
    evidence: ImageEvidence
  ): Observable<Response<ImageEvidenceI>> {
    const formData = parseImageEvidence(evidence);
    return this.http.post<Response<ImageEvidenceI>>(
      `${this.BASE_URL}/activity/${activityId}/image-evidence`,
      formData
    );
  }

  createDocumentEvidence(
    activityId: string,
    evidence: DocumentEvidence
  ): Observable<Response<DocumentEvidenceI>> {
    const formData = parseDocumentEvidence(evidence);
    return this.http.post<Response<DocumentEvidenceI>>(
      `${this.BASE_URL}/activity/${activityId}/document-evidence`,
      formData
    );
  }

  createLinkEvidence(
    activityId: string,
    evidence: LinkEvidence
  ): Observable<Response<DocumentEvidenceI>> {
    const linkEvidence = {
      description: evidence.value.description,
      link: evidence.value.link,
    };
    return this.http.post<Response<DocumentEvidenceI>>(
      `${this.BASE_URL}/activity/${activityId}/link-evidence`,
      linkEvidence
    );
  }
}
