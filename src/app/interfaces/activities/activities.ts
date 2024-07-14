import { Evidence, EvidenceWithFeedback } from '../evidences/evidences';

export interface Activity {
  id: string;
  name: string;
  summary: string;
  indicatorIndex: number;
  categoryName: string;
  unitId: string;
  uploadTimestamp: string;
  evidences: Evidence[];
}

export interface ActivityWithFeedback {
  id: string;
  name: string;
  summary: string;
  indicatorIndex: number;
  categoryName: string;
  unitId: string;
  uploadTimestamp: string;
  evidences: EvidenceWithFeedback[];
}

export interface Units {
  id: string;
  name: string;
  email: string;
  recomendedCategories: Categories[];
}

export interface Categories {
  indicatorIndex: number;
  categoryName: string;
}

export interface ActivityForm {
  name: string;
  summary: string;
  indicatorIndex: number;
  categoryName: string;
  unitId: string;
}

export interface UnitActivity {
  id: string;
  name: string;
  summary: string;
  indicatorIndex: number;
  categoryName: string;
  uploadTimestamp: string;
  evidence: Evidence[];
}

export interface ActivityFeedback {
  activityId: string;
  evidenceNumber: number;
  adminId: string;
  feedback: 'approved' | 'contact_admin' | 'broken_link' | 'broken_file';
}
