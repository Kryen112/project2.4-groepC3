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
  currentPenpals: Array<any>;
  send: Date;
  arrival: Date;

  constructor(private commService: CommunicationService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.getPenPals();
  }

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
          send: this.send,
          arrival: this.arrival
        })
        .subscribe(
        () => {
        });
      alert('Letter sent.');
    } else if (recipient == null) {
      alert('There is no recipient to send your letter to.');
    } else if (title == null) {
      alert('Please fill in a title for your letter.');
    } else if (text == null) {
      alert('There is no letter to send.')
    }
    this.recipient = null;
    this.letterTitle = null;
    this.letterText = null;
  }

  setRecipientPlaceholder(): string {
    if (this.recipient == null) {
      return 'Dear Recipient,';
    }
    return 'Dear ' + this.recipient + ',';
  }

  getCurrentDate(): string {
    return new Date().toDateString()
  }

  getPenPals(): void {
    let user = this.authService.getUser();
    this.commService.getPenPals(user)
      .subscribe(
        (currentPals) => {
          this.currentPenpals = currentPals[0].penpalList.sort();

        });
  }

}
