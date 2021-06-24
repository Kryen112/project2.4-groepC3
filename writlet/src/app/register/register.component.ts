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
      this.authService.register(val.name, val.password)
        .subscribe(
          () => {
            //this.router.navigate(['secret'])
          },
          () => {
            console.error('FOUT: ongeldige gegevens')
            this.errorColor="#ffccff"
          }
        );
    }
  }

}
