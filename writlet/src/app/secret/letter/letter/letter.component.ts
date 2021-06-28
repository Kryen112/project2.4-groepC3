import {Component, OnInit} from '@angular/core';
import {CommunicationService} from "../../../communication.service";
import {AuthService} from 'src/app/auth/auth.service';

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


  //de functie die checkt of de gebruiker bestaat eruit gehaald
  //deze moet straks de dropdown van de penpallist worden
  sendLetter(recipient: string, title: string, text: string): void {
    if(recipient && title && text) {
      this.username = this.authService.getUser();
      this.recipient = recipient;
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
      alert("Letter sent.");
    } else if (recipient == null) {
      alert("There is no recipient to send your letter to.");
    } else if (title == null) {
      alert("Please fill in a title for your letter.");
    } else if (text == null) {
      alert("There is no letter to send.")
    }
  }

  setRecipientPlaceholder(): string {
    if (this.recipient === null) {
      return "Dear Recipient,";
    }
    return "Dear " + this.recipient + ",";
  }

  getCurrentDate(): string {
    return new Date().toDateString()
  }

}
