import { inject, Injectable } from '@angular/core';
import { User } from '../../interfaces/user';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginForm, LoginResponse } from '../../interfaces/login/login';
import { map, Observable } from 'rxjs';
import { Response } from '../../interfaces/responses/response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly http = inject(HttpClient);
  private readonly BASE_URL = environment.BASE_URL;

  getMe(): Observable<Response<User>> {
    return this.http.get<Response<User>>(`${this.BASE_URL}/users/me`);
  }

  login(loginForm: LoginForm): Observable<Response<LoginResponse>> {
    return this.http.post<Response<LoginResponse>>(
      `${this.BASE_URL}/auth/login`,
      loginForm
    );
  }
}
