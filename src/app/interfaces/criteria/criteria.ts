export interface Criterion {
  indicatorIndex: number;
  subindex: number;
  englishName: string;
  spanishAlias: string;
}

export interface CriterionForm {
  subindex: number;
  englishName: string;
  spanishAlias: string;
}

export const initialCriterionForm = {
  subindex: 0,
  englishName: '',
  spanishAlias: '',
  categoryName: '',
};
