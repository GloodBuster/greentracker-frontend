export interface Evidence {
  evidenceNumber: number;
  link: string;
  description: string;
  uploadTimestamp: string;
  type: string;
  linkToRelatedResource?: string;
}

export interface ImageEvidenceI {
  evidenceNumber: number;
  link: string;
  description: string;
  uploadTimestamp: string;
  linkToRelatedResource?: string;
}

export interface DocumentEvidenceI {
  evidenceNumber: number;
  link: string;
  description: string;
  uploadTimestamp: string;
}
