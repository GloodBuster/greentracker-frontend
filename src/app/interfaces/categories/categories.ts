import { Criterion } from "../criteria/criteria";

export interface Categories {
    indicatorIndex: number;
    name: string;
  }
  
  export interface CategoriesForm {
    name: string;
  }
  
  export const initialCategoriesForm = {
    name: '',
  };

export interface CategorieDetails {
    name: string;
    criteria: Criterion[];
}