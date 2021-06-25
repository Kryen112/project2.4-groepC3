import { Component, OnInit } from '@angular/core';
import { CommunicationService } from "../../../communication.service";
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-letter',
  templateUrl: './letter.component.html',
  styleUrls: ['./letter.component.css']
})
export class LetterComponent implements OnInit {
  username: string;
  recipient: string;
  letterTitle: string;
  letterText: string;
  send: Date;
  arrival: Date;

  constructor(private commService: CommunicationService,
              private authService: AuthService) { }

  ngOnInit(): void { }

  sendLetter(recipient: string, title: string, text: string): void {
    if(recipient && title && text) {
      let user = this.authService.getUser();
      this.authService.friend(user, recipient)
        .subscribe(
          () => {
            this.username = user;
            this.send = new Date();
            this.arrival = new Date();
            this.arrival.setDate(this.send.getDate() + 1);
            this.letterTitle = title;
            this.letterText = text;
            this.commService.mail(
              {username: this.username,
                recipient: this.recipient,
                title: this.letterTitle,
                text: this.letterText,
                time: this.arrival
              })
              .subscribe(
              () => {
              });
          }
        );
    }
  }

  setRecipientPlaceholder(): string {
    if (this.recipient === null) {
      return "Dear Recipient,";
    }
    return "Dear " + this.recipient + ",";
  }

}
