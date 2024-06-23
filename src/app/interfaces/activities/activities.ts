import { Evidence } from '../evidences/evidences';

export interface Activity {
  id: string;
  name: string;
  summary: string;
  indicatorIndex: number;
  categoryName: string;
  unitId: string;
  uploadTimestamp: string;
  evidence: Evidence[];
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
