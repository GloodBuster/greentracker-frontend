import { CategorieDetails } from "../categories/categories";

export interface Criteria{
    subindex: number;
    englishName: string;
    spanishAlias: string;
    categoryName: string;
}
export interface Categories{
    name: string;
    criteria: Criteria[];
}
export interface indicatorForm{
    index: number;
    englishName: string;
    spanishAlias: string;
    categories: Categories[];
}

export interface Indicator{
    index: number;
    englishName: string;
    spanishAlias: string;
}

export interface IndicatorDetails extends Indicator {
    categories: CategorieDetails[];
}