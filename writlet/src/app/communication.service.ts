import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import { HttpClient } from '@angular/common/http'
import { shareReplay, tap } from 'rxjs/operators'
import {AuthService} from "./auth/auth.service";

const API_URL = 'http://localhost:5000/api/'

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  constructor(private http: HttpClient,
              private authService: AuthService,) {
  }

  mail(letter: { recipient: string; text: string; send: Date; arrival: Date; title: string; username: string }): Observable<any> {
    return this.http.post<Letter>(API_URL + 'mail', {letter},this.authService.header())
      .pipe(
        tap(
          res => this.sendData(res),
          err => this.handleError(err),
        ),
        shareReplay()
      );
  }

  private sendData(authResult: any):AuthService {
    return authResult;
  }

  addPenPal(user: string, penpal: string): Observable<any> {
    return this.http.post<Penpals>(API_URL + 'addpenpals', {user, penpal},this.authService.header())
      .pipe(
        tap(
          res => this.sendData(res),
          err => this.handleError(err),
        ),
        shareReplay()
      );
  }

  searchPenPal(searchString: string): Observable<any> {
    return this.http.get<any[]>(API_URL + 'searchpenpals/' + searchString,this.authService.header())
      .pipe(
        tap(
          res => this.sendData(res),
          err => this.handleError(err),
        ),
        shareReplay()
      );
  }

  getPenPals(currentUser: string): Observable<any> {
    return this.http.get<any[]>(API_URL + currentUser + '/getpenpals',this.authService.header())
      .pipe (
        tap (
          res => this.sendData(res),
          err => this.handleError(err),
        ),
        shareReplay()
      );
  }

  removePenPals(currentUser: string, penpalToRemove: string): Observable<any> {
    return this.http.put<any[]>(API_URL + currentUser + '/removepenpal/' + penpalToRemove,penpalToRemove,this.authService.header())
      .pipe (
        tap (
          res => this.sendData(res),
          err => this.handleError(err),
        ),
        shareReplay()
      );
  }

  removeLetter(letter: string): Observable<any> {
    return this.http.delete(API_URL + 'deleteletter/' + letter,this.authService.header())
      .pipe (
        tap (
          res => this.sendData(res),
          err => this.handleError(err),
        ),
        shareReplay()
      );
  }

  private handleError(error: any) {
    console.log(error);
  }

  getMail(user: string): Observable<any> {
    return this.http.get<any[]>(API_URL + 'mymail/' + user,this.authService.header())
      .pipe (
        tap (
          res => this.sendData(res),
          err => this.handleError(err),
        ),
        shareReplay()
      );
  }
}

interface Letter {
  letter:any
}

interface Penpals {
  name: string
}
