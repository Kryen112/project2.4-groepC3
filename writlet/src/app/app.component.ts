import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private router: Router,
              private authService: AuthService) { }

  checkHomeScreen(): boolean {
    return this.router.url === '/home';
  }

  checkLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}