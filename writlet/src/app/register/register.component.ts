import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
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

  register(): void {
    const val = this.form.value;

    if (val.name && val.password) {
      this.authService.register(val.name, val.password, [val.name])
        .subscribe(
          () => {
            alert("Registration successful. You can now login.");
          },
          () => {
            alert("Registration failed.");
            this.errorColor="#ffccff"
          }
        );
    } else if (!val.name) {
      alert("Please enter an available username.");
    } else if (!val.password) {
      alert("Please enter a password.");
    }
  }

}
