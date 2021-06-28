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
  data:Array<any>;

  constructor(public commService:CommunicationService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.getMail();
  }

  getMail(){
    let user = this.authService.getUser();
    console.log('username: ' + user);
    this.commService.getMail(user)
      .subscribe(
        (brieven) => {
          this.data = brieven;
          console.log(this.data);
        });
  }

  parseDate(dateString: string) {
    let date = new Date(dateString)
    return date.toDateString()
  }
}
