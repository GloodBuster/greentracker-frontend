export interface Criterion {
  indicatorIndex: number;
  subindex: number;
  englishName: string;
  spanishAlias: string;
  categoryName: string;
}

export const initialCriterion = {
  indicatorIndex: 0,
  subindex: 0,
  englishName: '',
  spanishAlias: '',
  categoryName: '',
};
