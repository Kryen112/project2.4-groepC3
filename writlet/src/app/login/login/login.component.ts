import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form:FormGroup;
  errorColor:string = "";

  constructor(private fb:FormBuilder,
              private authService: AuthService,
              private router: Router) {

    this.form = this.fb.group({
      name: ['',Validators.required],
      password: ['',Validators.required]
  });
  }

  ngOnInit(): void {
  }

  showPassword(): void {
    let x = <HTMLInputElement>document.getElementById("password");
    if (x.type === 'password') {
      x.type = 'text';
    } else {
      x.type = 'password';
    }
  }

  login(): void {
    const val = this.form.value;

    if (val.name && val.password) {
      this.authService.login(val.name, val.password)
        .subscribe(
          () => {
            this.router.navigate(['home'])
          },
          () => {
            alert('Password does not match the username.')
            this.errorColor='#ffccff'
          }
        );
    }
  }
}
