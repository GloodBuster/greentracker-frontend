
export interface Units {
    name: string;
    email: string;
  }

  export interface UnitsGet{
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
  