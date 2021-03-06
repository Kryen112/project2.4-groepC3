import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { CommunicationService } from 'src/app/communication.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  form:FormGroup;
  errorColor = '';
  username:string;
  oldname:string = this.authService.getUser();
  password:string;
  data:Array<any>;
  letter: boolean;
  capital: boolean;
  number: boolean;
  length: boolean;
  show: boolean;

  constructor(private fb:FormBuilder,
              private commService: CommunicationService,
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
      this.length = pwd.value.length >= 8;
    }
  }
  showPassword(): void {
    let x = <HTMLInputElement>document.getElementById('newPassword');
    if (x.type === 'password') {
      x.type = 'text';
    } else {
      x.type = 'password';
    }
  }

  showSecond(): void{
    let x = <HTMLInputElement>document.getElementById('oldPassword');
    if (x.type === 'password') {
      x.type = 'text';
    } else {
      x.type = 'password';
    }
  }


  disablePopup(): void{
    this.show = false;
  }

  userUpdated(): void {
    const val = this.form.value;

    if (val.name && val.olderPassword || val.name && val.newerPassword && val.olderPassword || val.newerPassword && val.olderPassword) {
      if(val.name){
        this.commService.user(val.name)
          .subscribe(
            (info) => {
              this.data = info;
              console.log(this.data);
              if(val.name === this.oldname){
                alert('New username cannot be old username.');
                return;
              }
              if(this.data['message'] === 'user exists'){
                alert('Username already taken.');
                return;
              }
              if(this.data['message'] === 'user not found'){
                this.commService.userInfo(this.oldname)
                  .subscribe(
                    (info) => {
                      this.data = info;
                      this.commService.hashCheck(this.oldname, val.olderPassword)
                        .subscribe(
                          (hash) => {
                            if(hash['message'] === 'hash was a match') {
                              this.username = val.name;
                              if (!val.newerPassword) {
                                this.password = '1';
                                this.commService.userUpdated(this.username, this.oldname, this.password)
                                  .subscribe(
                                    () => {
                                      alert('User information updated.');
                                      this.authService.logout();
                                      this.router.navigate(['home']);
                                      return;
                                    },
                                    () => {
                                      alert('Update failed.');
                                      this.errorColor = '#ffccff';
                                    }
                                  );
                              }
                              if (val.newerPassword) {
                                if (this.letter) {
                                  if (this.capital) {
                                    if (this.number) {
                                      if (this.length) {
                                        this.password = val.newerPassword;
                                        this.commService.hashCheck(this.oldname, val.newerPassword)
                                          .subscribe(
                                            (hash) => {
                                              if (hash['message'] === 'hash was a match') {
                                                alert('New password cant be old password.');
                                                return;
                                              }
                                              else{
                                                this.commService.userUpdated(this.username, this.oldname, this.password)
                                                  .subscribe(
                                                    () => {
                                                      alert('User information updated.');
                                                      this.authService.logout();
                                                      this.router.navigate(['home']);
                                                      return;
                                                    },
                                                    () => {
                                                      alert('Update failed.');
                                                      this.errorColor = '#ffccff';
                                                    }
                                                  );
                                              }
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
                              }
                            }
                            else{
                              alert('Password is incorrect.');
                              return;
                            }
                          }
                        );
                      }
                  );
              }
            },
            () => {
              alert('Update failed.');
              this.errorColor='#ffccff';
            }
          );
      }
      else if(!val.name){
        this.commService.userInfo(this.oldname)
          .subscribe(
            (info) => {
              this.data = info;
              this.commService.hashCheck(this.oldname, val.olderPassword)
                .subscribe(
                  (hash) => {
                    if(hash['message'] === 'hash was a match') {
                      this.username = this.oldname;
                      if (!val.newerPassword) {
                        this.password = '1';
                        this.commService.userUpdated(this.username, this.oldname, this.password)
                          .subscribe(
                            () => {
                              alert('User information updated.');
                              this.authService.logout();
                              this.router.navigate(['home']);
                              return;
                            },
                            () => {
                              alert('Update failed.');
                              this.errorColor = '#ffccff';
                            }
                          );
                      }
                      if (val.newerPassword) {
                        if (this.letter) {
                          if (this.capital) {
                            if (this.number) {
                              if (this.length) {
                                this.password = val.newerPassword;
                                this.commService.hashCheck(this.oldname, val.newerPassword)
                                  .subscribe(
                                    (hash) => {
                                      if (hash['message'] === 'hash was a match') {
                                        alert('New password cant be old password.');
                                        return;
                                      }
                                      else{
                                        this.commService.userUpdated(this.username, this.oldname, this.password)
                                          .subscribe(
                                            () => {
                                              alert('user information updated.');
                                              this.authService.logout();
                                              this.router.navigate(['home']);
                                              return;
                                            },
                                            () => {
                                              alert('Update failed.');
                                              this.errorColor = '#ffccff';
                                            }
                                          );
                                      }
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
                      }
                    }
                    else{
                      alert('Password is incorrect.');
                      return;
                    }
                  }
                );
            }
          );
      }
    } else if (!val.name && !val.newerPassword) {
      alert('Please enter either a new username or new password.');
    } else if (!val.olderPassword) {
      alert('Please enter your old password to update.');
    }
  }
}
