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
  errorColor:string = '';
  letter: boolean;
  capital: boolean;
  number: boolean;
  length: boolean;
  show: boolean;

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

  onKeyUp(): void {
    let pwd = this.form.get('password');

    this.show = true;

    if (pwd) {
      // Validate lowercase letters
      let lowerCaseLetters = /[a-z]/g;
      this.letter = !!pwd.value.match(lowerCaseLetters);

      // Validate capital letters
      let upperCaseLetters = /[A-Z]/g;
      this.capital = !!pwd.value.match(upperCaseLetters);

      // Validate numbers
      let numbers = /[0-9]/g;
      this.number = !!pwd.value.match(numbers);

      // Validate length
      this.length = pwd.value.length >= 8 && pwd.value.length < 16;
    }
  }

  showPassword(): void {
    let x = <HTMLInputElement>document.getElementById('password');
    if (x.type === 'password') {
      x.type = 'text';
    } else {
      x.type = 'password';
    }
  }

  disablePopup(): void {
    this.show = false;
  }

  register(): void {
    const val = this.form.value;

    if (val.name) {
      if (val.password) {
        if (this.letter) {
          if (this.capital) {
            if (this.number) {
              if (this.length) {
                this.authService.register(val.name, val.password)
                .subscribe(
                  () => {
                    alert('Registration successful. You can now login.');
                    this.router.navigate(['/login']);
                  },
                  () => {
                    alert(val.name +  'is already taken. Registration failed.');
                    this.errorColor='#ffccff';
                  }
                );
              } else {
                alert('Password must be longer than 6 characters and smaller than 16 characters.');
              }
            } else {
              alert('Password must contain a number (0-9).');
            }
          } else {
            alert('Password must contain an uppercase, alphabetic letter.');
          }
        } else {
          alert('Password must contain a lowercase, alphabetic letter.');
        }
      } else {
        alert('Please enter a password.');
      }
    } else {
      alert('Please enter a username.');
    }
  }
}
