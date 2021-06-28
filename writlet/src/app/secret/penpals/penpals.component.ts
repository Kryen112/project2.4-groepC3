import { ArrayType } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { CommunicationService } from 'src/app/communication.service';
import {Router, RouterModule} from "@angular/router";

@Component({
  selector: 'app-penpals',
  templateUrl: './penpals.component.html',
  styleUrls: ['./penpals.component.css']
})
export class PenpalsComponent implements OnInit {
  currentUser: string;
  userToAdd: string;
  form: FormGroup;
  searchPenpals: Array<any>;
  currentPenpals: Array<any>;

  constructor(private commService: CommunicationService,
              private authService: AuthService,
              private fb: FormBuilder,
              private router: Router) {

    this.form = this.fb.group({
      penpal: ['',Validators.required]
    });
  }

  ngOnInit(): void {
    this.getPenPals();
  }

  addPenPal(penpal: string): void {
    console.log("addpenpal in penpals component");
    let currentUser = this.authService.getUser();
    this.commService.addPenPal(currentUser, penpal)
    .subscribe( () => {
      console.log(currentUser + ' ' + penpal);
    });
    this.getPenPals();
  }

  searchPenPal(): void {
    console.log("Searching pen pals");
    this.searchPenpals = new Array;
    const val = this.form.value;
    let searchString = val.penpal;
    this.commService.searchPenPal(searchString)
    .subscribe( (searchPals) => {
      this.searchPenpals = searchPals;
      console.log(this.searchPenpals);
    });
  }

  getPenPals(): void {
    console.log("Getting pen pals");
    let user = this.authService.getUser();
    console.log('username: ' + user);
    this.commService.getPenPals(user)
      .subscribe(
        (currentPals) => {
          this.currentPenpals = currentPals[0].penpalList.sort();
          console.log(this.currentPenpals);
        });
  }

  removePenPal(penpal: string): void {
    console.log("Removing pen pal");
    let user = this.authService.getUser();
    this.commService.removePenPals(user, penpal)
      .subscribe(() => { });
    this.getPenPals();
  }

}
