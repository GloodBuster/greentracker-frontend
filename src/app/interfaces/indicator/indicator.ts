import { CategorieDetails } from "../categories/categories";

export interface Indicator {
    index: number;
    englishName: string;
    spanishAlias: string;
}

export interface IndicatorDetails extends Indicator {
    categories: CategorieDetails[];
}