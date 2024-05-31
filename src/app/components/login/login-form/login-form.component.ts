import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { LoginForm } from '../../../interfaces/login/login';
import { CustomHttpErrorResponse } from '../../../interfaces/responses/error';
import { Router } from '@angular/router';
import { Role } from '../../../enums/role';
import { routes } from '../../../routes';

@Component({
  selector: 'login-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    FloatLabelModule,
    PanelModule,
    PasswordModule,
    ButtonModule,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent {
  authService = inject(AuthService);
  toastService = inject(ToastrService);
  router = inject(Router);

  loading = false;

  userLoginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  submitForm() {
    const formValues: LoginForm = this.userLoginForm.value as LoginForm;
    this.loading = true;
    this.authService.login(formValues).subscribe({
      next: (response) => {
        const data = response.data;
        localStorage.setItem('token', data.token);
        this.toastService.success('Logeado con éxito');
        if (data.user.role === Role.ADMIN) {
          this.router.navigate([routes.adminHomePage]);
        } else if (data.user.role === Role.UNIT) {
          this.router.navigate([routes.unitHomePage]);
        }
        this.loading = false;
      },
      error: (error: CustomHttpErrorResponse) => {
        const errorResponse = error.error;
        if (errorResponse.statusCode === 401) {
          this.toastService.error('Credenciales inválidas');
        } else {
          this.toastService.error('Ha ocurrido un error');
        }
        this.loading = false;
      },
    });
  }
}
