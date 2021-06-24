import { Component, OnInit } from '@angular/core';
import {CommunicationService} from "../../../communication.service";
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-letter',
  templateUrl: './letter.component.html',
  styleUrls: ['./letter.component.css']
})
export class LetterComponent implements OnInit {
  username:string;
  recipient:string;
  letterTitle:string;
  letterText:string;
  time;



  constructor(public commService:CommunicationService,
              private authService: AuthService) { }

  ngOnInit(): void {  }


  sendLetter(recipient, title, text){
    if(recipient && title && text){
      let user = this.authService.getUser();
      this.authService.friend(user, recipient)
        .subscribe(
          () => {
            this.username = user;
            this.time = new Date();
            this.letterTitle = title;
            this.letterText = text;
            this.commService.nextLetter(
              {username: this.username,
                recipient: this.recipient,
                title: this.letterTitle,
                text: this.letterText,
                time: this.time
              });
            this.commService.mail(
              {username: this.username,
                recipient: this.recipient,
                title: this.letterTitle,
                text: this.letterText,
                time: this.time
              })
              .subscribe(
              () => {
              });
          }
        );
    }
  }

  setRecipientPlaceholder() {
    if (this.recipient == null) {
      return "Dear Recipient,";
    }
    return "Dear " + this.recipient + ",";
  }


}
