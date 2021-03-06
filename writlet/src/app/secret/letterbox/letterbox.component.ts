import {Component, OnInit} from '@angular/core';
import {CommunicationService} from '../../communication.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-letterbox',
  templateUrl: './letterbox.component.html',
  styleUrls: ['./letterbox.component.css']
})
export class LetterboxComponent implements OnInit {
  username:string;
  data: Array<any>;
  readableLetters: Array<any>;


  constructor(public commService:CommunicationService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.data = new Array<any>();
    this.readableLetters = new Array<any>()
    this.getMail();
  }

  getMail(): void {
    let user = this.authService.getUser();
    this.commService.getMail(user)
      .subscribe(
        (brieven) => {
          this.data = brieven;
          this.setReadableLetters(brieven);
        });

  }

  parseDate(dateString: string): string {
    let date = new Date(dateString)
    return date.toDateString()
  }

  getDate(dateString: string): boolean {
    let deliverDate = new Date(dateString);
    let currentDate = new Date();
    return currentDate > deliverDate;
  }

  setReadableLetters(data: any[]): void {
    for (let letter of data) {
      if (this.getDate(letter['letter']['arrival'])) {

        this.readableLetters.push(letter);
      }
    }
  }
}
