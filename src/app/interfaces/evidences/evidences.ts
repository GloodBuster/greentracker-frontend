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

export interface EvidenceWithFeedback {
  evidenceNumber: number;
  link: string;
  description: string;
  uploadTimestamp: string;
  type: string;
  linkToRelatedResource?: string;
  feedbacks: Feedback[];
}

export interface Feedback {
  adminId: string;
  feedback: 'approved' | 'contact_admin' | 'broken_link' | 'broken_file';
}
