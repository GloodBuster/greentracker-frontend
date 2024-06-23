import { Criterion, CriterionForm } from "../criteria/criteria";

export interface Categories {
    indicatorIndex: number;
    name: string;
  }
  
export interface CriteriaSubIndex{
   subindex: number;
}
  export interface CategoriesForm {
    name: string;
    criteria: CriteriaSubIndex[];
  }
  
  export const initialCategoriesForm = {
    name: '',
  };

export interface CategorieDetails {
    name: string;
    criteria: Criterion[];
}

export interface CategoriesByIndicator {
  indicatorIndex: number;
  name: string;
  criteria: CriterionForm[];
}
