import { Criterion, CriterionForm } from '../criteria/criteria';

export interface Categories {
  indicatorIndex: number;
  name: string;
  helpText: string;
}

export interface CriteriaSubIndex {
  subindex: number;
}
export interface CategoriesForm {
  name: string;
  helpText: string;
  criteria: CriteriaSubIndex[];
}

export const initialCategoriesForm = {
  name: '',
  helpText: '',
};

export interface CategorieDetails {
  name: string;
  criteria: Criterion[];
}

export interface UnitCategory {
  categoryName: string;
  indicatorIndex: number;
}

export interface CategoriesByIndicator {
  name: string;
  helpText: string;
  criteria: CriterionForm[];
}
