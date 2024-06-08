import { Component } from '@angular/core';
import { LandingPageNavbarComponent } from '../../components/landing-page-navbar/landing-page-navbar.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [LandingPageNavbarComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

}
