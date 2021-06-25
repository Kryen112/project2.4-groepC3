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

  constructor(private commService: CommunicationService,
              private authService: AuthService,
              private fb: FormBuilder) { 

    this.form = this.fb.group({
      penpal: ['',Validators.required]
    });
  }

  ngOnInit(): void {
  }

  addPenPal(): void {
    console.log("addpenpal in penpals component");
    const val = this.form.value;
    let currentUser = this.authService.getUser();
    let userToAdd = val.penpal;
      this.commService.addPenPal(currentUser, userToAdd)
      .subscribe( () => {});
  }

}
