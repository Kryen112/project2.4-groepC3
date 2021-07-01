import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { CommunicationService } from 'src/app/communication.service';

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
              private fb: FormBuilder)

  {
    this.form = this.fb.group({
      penpal: ['',Validators.required]
    });
  }

  ngOnInit(): void {
    this.getPenPals();
  }

  addPenPal(penpal: string): void {
    let currentUser = this.authService.getUser();
    this.commService.addPenPal(currentUser, penpal)
    .subscribe( () => {
    });
    this.getPenPals();
  }

  searchPenPal(): void {
    this.searchPenpals = new Array;
    const val = this.form.value;
    let searchString = val.penpal;
    this.commService.searchPenPal(searchString)
    .subscribe( (searchPals) => {
      this.searchPenpals = searchPals;
    });
  }

  getPenPals(): void {
    let user = this.authService.getUser();
    this.commService.getPenPals(user)
      .subscribe(
        (currentPals) => {
          this.currentPenpals = currentPals[0].penpalList.sort();
        });
  }

  removePenPal(penpal: string): void {
    let user = this.authService.getUser();
    this.commService.removePenPals(user, penpal)
      .subscribe(() => { });
    this.getPenPals();
  }
}
