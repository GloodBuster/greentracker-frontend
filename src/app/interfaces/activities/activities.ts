import { Evidence } from '../evidences/evidences';

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

export enum FeedbackEnum {
  approved = 'Approved',
  contact_admin = 'Contact_admin',
  broken_link = 'Broken_link',
  broken_file = 'Broken_file',
}

export interface Feedback {
  feedback: FeedbackEnum;
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
