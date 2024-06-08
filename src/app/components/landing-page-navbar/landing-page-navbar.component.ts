import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { routes } from '../../routes';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing-page-navbar',
  standalone: true,
  imports: [ImageModule, ButtonModule, RouterModule],
  templateUrl: './landing-page-navbar.component.html',
  styleUrl: './landing-page-navbar.component.scss',
})
export class LandingPageNavbarComponent {
  loginRoute = routes.login;
}
