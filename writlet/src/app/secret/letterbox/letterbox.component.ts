import { Component, OnInit } from '@angular/core';
import {CommunicationService} from "../../communication.service";
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-letterbox',
  templateUrl: './letterbox.component.html',
  styleUrls: ['./letterbox.component.css']
})
export class LetterboxComponent implements OnInit {
  username:string;

  constructor(public commService:CommunicationService,
              private authService: AuthService) { }

  ngOnInit(): void {  }

  getMail(){
    let user = this.authService.getUser();
    console.log(this.commService.getMail(user));
  }
}
