import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  form:FormGroup;
  errorColor:string = "";
  username:string;
  oldname:string = this.authService.getUser();
  password:string;
  data:Array<any>;
  letter: boolean;
  capital: boolean;
  number: boolean;
  length: boolean;

  constructor(private fb:FormBuilder,
              private authService: AuthService,
              private router: Router) {

    this.form = this.fb.group({
      name: ['',Validators.required],
      newerPassword: ['',Validators.required],
      olderPassword: ['',Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onKeyUp(): void {
    let pwd = this.form.get('newerPassword');

    document.getElementById("message").style.display = "block";

    if (pwd) {
      // Validate lowercase letters
      let lowerCaseLetters = /[a-z]/g;
      if(pwd.value.match(lowerCaseLetters)) {
        this.letter = true;
      } else {
        this.letter = false;
      }

      // Validate capital letters
      let upperCaseLetters = /[A-Z]/g;
      if(pwd.value.match(upperCaseLetters)) {
        this.capital = true;
      } else {
        this.capital = false;
      }

      // Validate numbers
      let numbers = /[0-9]/g;
      if(pwd.value.match(numbers)) {
        this.number = true;
      } else {
        this.number = false;
      }

      // Validate length
      if(pwd.value.length >= 8 && pwd.value.length < 16) {
        this.length = true;
      } else {
        this.length = false;
      }
    }
  }
  showPassword(): void {
    let x = <HTMLInputElement>document.getElementById("newPassword");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }

  userUpdated(): void {
    const val = this.form.value;

    if (val.name && val.olderPassword || val.name && val.newerPassword && val.olderPassword || val.newerPassword && val.olderPassword) {
      if(val.name){
        this.authService.user(val.name)
          .subscribe(
            (info) => {
              this.data = info;
              if(val.name === this.oldname){
                alert("new username cant be old username");
                return;
              }
              if(this.data['message'] === "user exists"){
                alert("username already taken");
                return;
              }
              if(this.data['message'] === "user not found"){
                this.authService.userInfo(this.oldname)
                  .subscribe(
                    (info) => {
                      this.data = info;
                      this.authService.hashCheck(this.oldname, val.olderPassword)
                        .subscribe(
                          (hash) => {
                            if(hash['message'] === "hash was a match") {
                              this.username = val.name;
                              if (!val.newerPassword) {
                                this.password = "1";
                              }
                              if (val.newerPassword) {
                                if (this.letter) {
                                  if (this.capital) {
                                    if (this.number) {
                                      if (this.length) {
                                        this.password = val.newerPassword;
                                        this.authService.hashCheck(this.oldname, val.newerPassword)
                                          .subscribe(
                                            (hash) => {
                                              if (hash['message'] === "hash was a match") {
                                                alert("new password cant be old password");
                                                return;
                                              }
                                            }
                                          );
                                      } else {
                                      alert("Password must be longer than 6 characters and smaller than 16 characters.");
                                      }
                                    } else {
                                      alert("Password must contain a number (0-9).");
                                    }
                                  } else {
                                    alert("Password must contain an uppercase, alphabetic letter.");
                                  }
                                } else {
                                  alert("Password must contain a lowercase, alphabetic letter.");
                                }
                              }
                              this.authService.userUpdated(this.username, this.oldname, this.password)
                                .subscribe(
                                  () => {
                                    alert("user information updated");
                                    this.authService.logout();
                                    this.router.navigate(['home']);
                                    return;
                                  },
                                  () => {
                                    alert("update failed");
                                    this.errorColor = "#ffccff"
                                  }
                                );
                            }
                            else{
                              alert("password is incorrect");
                              return;
                            }
                          }
                        );
                      }
                  );
              }
            },
            () => {
              alert("update failed");
              this.errorColor="#ffccff"
            }
          );
      }
      else if(!val.name){
        this.authService.userInfo(this.oldname)
          .subscribe(
            (info) => {
              this.data = info;
              this.authService.hashCheck(this.oldname, val.olderPassword)
                .subscribe(
                  (hash) => {
                    if(hash['message'] === "hash was a match") {
                      this.username = this.oldname;
                      if (!val.newerPassword) {
                        this.password = "1";
                      }
                      if (val.newerPassword) {
                        if (this.letter) {
                          if (this.capital) {
                            if (this.number) {
                              if (this.length) {
                                this.password = val.newerPassword;
                                this.authService.hashCheck(this.oldname, val.newerPassword)
                                  .subscribe(
                                    (hash) => {
                                      if (hash['message'] === "hash was a match") {
                                        alert("new password cant be old password");
                                        return;
                                      }
                                    }
                                  );
                              } else {
                                alert("Password must be longer than 6 characters and smaller than 16 characters.");
                              }
                            } else {
                              alert("Password must contain a number (0-9).");
                            }
                          } else {
                            alert("Password must contain an uppercase, alphabetic letter.");
                          }
                        } else {
                          alert("Password must contain a lowercase, alphabetic letter.");
                        }
                      }
                      this.authService.userUpdated(this.username, this.oldname, this.password)
                        .subscribe(
                          () => {
                            alert("user information updated");
                            this.authService.logout();
                            this.router.navigate(['home']);
                            return;
                          },
                          () => {
                            alert("update failed");
                            this.errorColor = "#ffccff"
                          }
                        );
                    }
                    else{
                      alert("password is incorrect");
                      return;
                    }
                  }
                );
            }
          );
      }
    } else if (!val.name && !val.newerPassword) {
      alert("Please enter either a new username or new password.");
    } else if (!val.olderPassword) {
      alert("Please enter your old password to update.");
    }
  }
}
