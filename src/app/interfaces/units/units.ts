import { Categories } from '../categories/categories';

export interface Units {
  name: string;
  email: string;
}

export interface UnitsGet {
  id: string;
  name: string;
  email: string;
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
  contributedCategories: Categories[];
}
