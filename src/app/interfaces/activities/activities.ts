export interface Units {
    id: string;
    name: string;
    email: string;
    recomendedCategories: Categories[];
}

export interface Categories{
    indicatorIndex: number;
    categoryName: string;
}