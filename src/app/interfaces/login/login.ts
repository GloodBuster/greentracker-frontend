import { User } from '../user';

export interface LoginForm {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
