import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import { HttpClient } from '@angular/common/http'
import { shareReplay, tap } from 'rxjs/operators'

import * as moment from 'moment';
import * as jwt_decode from 'jwt-decode';

const API_URL = 'http://localhost:5000/api/'

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  constructor(private http: HttpClient) {
  }

  mail(letter: { recipient: string; text: string; time: any; title: string; username: string }) {
    return this.http.post<Letter>(API_URL+'mail', {letter})
      .pipe (
        tap (
          res => this.sendLetter(res),
          err => this.handleError(err),
        ),
        shareReplay()
      );
  }

  private sendLetter(authResult: any) {
    return authResult;
  }

  private handleError(error: any) {
    console.log(error);
  }

  getMail(user: string) {
    return this.http.get<any[]>(API_URL+'mymail/'+user)
      .pipe (
        tap (
          res => this.myMail(res),
          err => this.handleError(err),
        ),
        shareReplay()
      );
  }

  private myMail(authResult: any) {
    console.log('authResult: ' + authResult);
    return authResult;
  }

  letter = new BehaviorSubject(null);
  sharedLetter = this.letter.asObservable();
}

interface Letter {
  letter:any
}




