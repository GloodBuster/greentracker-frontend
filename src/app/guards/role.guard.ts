import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { User } from '../interfaces/user';
import { AuthService } from '../services/auth/auth.service';
import { Role } from '../enums/role';
import { ErrorResponse } from '../interfaces/responses/error';
import { Response } from '../interfaces/responses/response';
import { catchError, map, of } from 'rxjs';
import { routes } from '../routes';

export const hasRoleGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);
  const expectedRoles: Role = route.data['role'];
  return authService.getMe().pipe(
    map((response: Response<User>) => {
      if (response.data.role === expectedRoles) {
        return true;
      } else {
        if (response.data.role === Role.ADMIN)
          router.navigate([routes.adminHomePage]);
        else if (response.data.role === Role.UNIT)
          router.navigate([routes.unitHomePage]);
        else router.navigate([routes.login]);
        return false;
      }
    }),
    catchError((error: ErrorResponse) => {
      router.navigate([routes.login]);
      return of(false);
    })
  );
};
