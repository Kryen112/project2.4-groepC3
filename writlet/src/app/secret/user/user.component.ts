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

  userUpdated(): void {
    const val = this.form.value;

    if (val.name && val.olderPassword || val.name && val.newerPassword && val.olderPassword || val.newerPassword && val.olderPassword) {
      if(val.name){
        this.authService.user(val.name)
          .subscribe(
            (info) => {
              this.data = info;
              if(val.name === this.authService.getUser()){
                alert("new username cant be old username");
                return;
              }
              if(this.data['message'] === "user exists"){
                alert("username already taken");
                return;
              }
              if(this.data['message'] === "user not found"){
                this.authService.userInfo(this.authService.getUser())
                  .subscribe(
                    (info) => {
                      this.data = info;
                      this.oldname = this.data['name'];
                      this.authService.hashCheck(this.oldname, val.olderPassword)
                        .subscribe(
                          (hash) => {
                            if(hash['message'] === "hash was a match") {
                              this.username = val.name;
                              if (!val.newerPassword) {
                                this.password = this.data['password'];
                              }
                              if (val.newerPassword) {
                                this.password = val.newerPassword;
                              }
                              this.authService.userUpdated(this.username, this.oldname, this.password)
                                .subscribe(
                                  () => {
                                    alert("user information updated");
                                    this.authService.logout();
                                    this.router.navigate(['home'])
                                  },
                                  () => {
                                    alert("update failed");
                                    this.errorColor = "#ffccff"
                                  }
                                );
                            }
                            else{
                              alert("password is incorrect");
                            }
                          }
                        );
                      this.authService.hashCheck(this.oldname, val.newerPassword)
                        .subscribe(
                          (hash) => {
                            if (hash['message'] === "hash was a match") {
                              alert("new password cant be old password");
                            }
                            else if (hash['message'] === "hash was no match"){
                              this.username = val.name;
                              if (!val.newerPassword) {
                                this.password = this.data['password'];
                              }
                              if (val.newerPassword) {
                                this.password = val.newerPassword;
                              }
                              this.authService.userUpdated(this.username, this.oldname, this.password)
                                .subscribe(
                                  () => {
                                    alert("user information updated");
                                    this.authService.logout();
                                    this.router.navigate(['home'])
                                  },
                                  () => {
                                    alert("update failed");
                                    this.errorColor = "#ffccff"
                                  }
                                );
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
        this.authService.userInfo(this.authService.getUser())
          .subscribe(
            (info) => {
              this.data = info;
              this.oldname = this.data['name'];
              this.authService.hashCheck(this.oldname, val.olderPassword)
                .subscribe(
                  (hash) => {
                    if(hash['message'] === "hash was a match") {
                      this.username = val.name;
                      if (!val.newerPassword) {
                        this.password = this.data['password'];
                      }
                      if (val.newerPassword) {
                        this.password = val.newerPassword;
                      }
                      this.authService.userUpdated(this.username, this.oldname, this.password)
                        .subscribe(
                          () => {
                            alert("user information updated");
                            this.authService.logout();
                            this.router.navigate(['home'])
                          },
                          () => {
                            alert("update failed");
                            this.errorColor = "#ffccff"
                          }
                        );
                    }
                    else{
                      alert("password is incorrect");
                    }
                  }
                );
              this.authService.hashCheck(this.oldname, val.newerPassword)
                .subscribe(
                  (hash) => {
                    if (hash['message'] === "hash was a match") {
                      alert("new password cant be old password");
                    }
                    else if (hash['message'] === "hash was no match"){
                      this.username = this.oldname;
                      if (!val.newerPassword) {
                        this.password = this.data['password'];
                      }
                      if (val.newerPassword) {
                        this.password = val.newerPassword;
                      }
                      this.authService.userUpdated(this.username, this.oldname, this.password)
                        .subscribe(
                          () => {
                            alert("user information updated");
                            this.authService.logout();
                            this.router.navigate(['home'])
                          },
                          () => {
                            alert("update failed");
                            this.errorColor = "#ffccff"
                          }
                        );
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
