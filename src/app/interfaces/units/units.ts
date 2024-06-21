import { Categories } from "../categories/categories";

export interface Units {
    name: string;
    email: string;
  }

  export interface UnitsGet{
    id: string;
    name: string;
    email: string;
    recommendedCategories: CategoriesForm[];
  }
  
  export interface UnitsForm {
    name: string;
    email: string;
  }
  
  export const initialUnitsForm = {
    name: '',
    email: '',
    password: '',
  };
  
  export interface UnitDetails {
    id: string;
    name: string;
    email: string;
    recommendedCategories: Categories[];
  }

  export interface Criteria{
    subindex: number;
    englishName: string;
    spanishAlias: string;
    categoryName: string;
  }
  export interface CategoriesData{
    name: string;
    criteria: Criteria[];
  }

  export interface Indicators{
    index: number;
    englishName: string;
    spanishAlias: string;
    categories: CategoriesData[];
  }

  export interface CategoriesForm{
    indicatorIndex: number;
    categoryName: string;
  }