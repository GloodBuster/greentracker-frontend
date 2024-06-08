import { Component } from '@angular/core';
import { LoginFormComponent } from '../../components/login/login-form/login-form.component';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoginFormComponent, ImageModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {}
