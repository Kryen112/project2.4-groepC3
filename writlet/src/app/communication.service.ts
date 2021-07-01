import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { shareReplay, tap } from 'rxjs/operators'
import {AuthService} from './auth/auth.service';

const API_URL = 'http://localhost:5000/api/'

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  constructor(private http: HttpClient,
              private authService: AuthService,) {
  }

  private sendData(authResult: any):AuthService {
    return authResult;
  }

  private handleError(error: any) {
    console.log(error);
  }

  login(name:string, password:string): Observable<any> {
    return this.http.post<User>(API_URL + 'login', {name, password})
        .pipe (
            tap (
                res => this.authService.setSession(res),
                err => this.handleError(err),
            ),
            shareReplay()
        );
  }

  register(name:string, password:string): Observable<any>  {
    return this.http.post<User>(API_URL + 'register', {name, password})
        .pipe (
            tap (
                res => this.sendData(res),
                err => this.handleError(err),
            ),
            shareReplay()
        );
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

  addPenPal(user: string, penpal: string): Observable<any> {
    return this.http.post<Penpals>(API_URL + 'addpenpals', {user, penpal}, this.authService.header())
      .pipe(
        tap(
          res => this.sendData(res),
          err => this.handleError(err),
        ),
        shareReplay()
      );
  }

  searchPenPal(searchString: string): Observable<any> {
    return this.http.get<any[]>(API_URL + 'searchpenpals/' + searchString, this.authService.header())
      .pipe(
        tap(
          res => this.sendData(res),
          err => this.handleError(err),
        ),
        shareReplay()
      );
  }

  getPenPals(currentUser: string): Observable<any> {
    return this.http.get<any[]>(API_URL + currentUser + '/getpenpals', this.authService.header())
      .pipe (
        tap (
          res => this.sendData(res),
          err => this.handleError(err),
        ),
        shareReplay()
      );
  }

  removePenPals(currentUser: string, penpalToRemove: string): Observable<any> {
    return this.http.put<any[]>(API_URL + currentUser + '/removepenpal/' + penpalToRemove, penpalToRemove, this.authService.header())
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

  getMail(user: string): Observable<any> {
    return this.http.get<any[]>(API_URL + 'mymail/' + user, this.authService.header())
      .pipe (
        tap (
          res => this.sendData(res),
          err => this.handleError(err),
        ),
        shareReplay()
      );
  }

  user(user: string): Observable<any>  {
    return this.http.get<any[]>(API_URL + 'users/' + user, this.authService.header())
      .pipe(
        tap(
          res => this.sendData(res),
          err => this.handleError(err),
        ),
        shareReplay()
    );
  }

  userInfo(user: string): Observable<any>  {
    return this.http.get<any[]>(API_URL + 'userinfo/' + user, this.authService.header())
      .pipe(
        tap(
          res => this.sendData(res),
          err => this.handleError(err),
        ),
        shareReplay()
      );
  }

  userUpdated(name:string, oldname:string, password:string): Observable<any>  {
    return this.http.post<UserUpdate>(API_URL + 'userupdate', {name, oldname, password}, this.authService.header())
      .pipe (
        tap (
          res => this.sendData(res),
          err => this.handleError(err),
        ),
        shareReplay()
      );
  }

  hashCheck(name:string, password:string): Observable<any>  {
    return this.http.get<any[]>(API_URL + 'users/' + name + '/hashcheck/' + password, this.authService.header())
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

interface User {
  name: string,
  password: string,
}

interface UserUpdate {
  name: string,
  oldname: string,
  password: string,
}
