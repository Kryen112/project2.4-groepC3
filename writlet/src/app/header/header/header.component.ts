import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  dropDownActive;
  show;
  constructor(private auth: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.dropDownActive = false;
    this.show = false;
  }

  checkLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['home']);
  }

  toggleDropDown() {
    this.dropDownActive = !this.dropDownActive;
    this.show = !this.show;

  }
}
