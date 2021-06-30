import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { shareReplay, tap } from 'rxjs/operators'
import { HttpHeaders } from "@angular/common/http";

import * as moment from 'moment';
import * as jwt_decode from 'jwt-decode';
import {Observable} from "rxjs";

const API_URL = 'http://localhost:5000/api/'

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private http: HttpClient) {
    }

  public header(): { headers: HttpHeaders } {
    let header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${localStorage.getItem('id_token')}`)
    }
    return header;
  }

    login(name:string, password:string): Observable<any> {
        return this.http.post<User>(API_URL+'login', {name, password})
            .pipe (
                tap (
                    res => this.setSession(res),
                    err => this.handleError(err),
                ),
                shareReplay()
            );
    }

    register(name:string, password:string): Observable<any>  {
      return this.http.post<User>(API_URL+'register', {name, password})
            .pipe (
                tap (
                    res => this.setUser(res),
                    err => this.handleError(err),
                ),
                shareReplay()
            );
    }

    user(user: string): Observable<any>  {
      return this.http.get<any[]>(API_URL+'users/'+user,this.header())
        .pipe(
          tap(
            res => this.userExists(res),
            err => this.handleError(err),
          ),
          shareReplay()
      );
    }

    userInfo(user: string): Observable<any>  {
      return this.http.get<any[]>(API_URL+'userinfo/'+user,this.header())
        .pipe(
          tap(
            res => this.getInformation(res),
            err => this.handleError(err),
          ),
          shareReplay()
        );
    }

    private getInformation(authResult: any): AuthService  {
      return authResult;
    }

    userUpdated(name:string, oldname:string, password:string): Observable<any>  {
      return this.http.post<UserUpdate>(API_URL+'userupdate', {name, oldname, password},this.header())
        .pipe (
          tap (
            res => this.userExists(res),
            err => this.handleError(err),
          ),
          shareReplay()
        );
    }

    hashCheck(name:string, password:string): Observable<any>  {
      return this.http.get<any[]>(API_URL+'users/'+name+'/hashcheck/'+password,this.header())
        .pipe (
          tap (
            res => this.userExists(res),
            err => this.handleError(err),
          ),
          shareReplay()
        );
    }

    addPenPal(user: string, penpal: string): Observable<any>  {
      return this.http.post<Penpal>(API_URL + 'penpals', {user, penpal},this.header())
        .pipe(
          tap(
            res => this.userExists(res),
            err => this.handleError(err),
          ),
          shareReplay()
      );
    }

    private userExists(authResult: any): AuthService {
      return authResult;
    }

    private setUser(authResult: any): AuthService {
      return authResult;
    }

    public isLoggedIn(): boolean  {
        return moment().isBefore(this.getExpiration());
    }

    private setSession(authResult: any): void {
        const expiresAt = moment().add(authResult.expiresIn, 'milliseconds');
        localStorage.setItem('id_token', authResult.token);
        localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
    }

    public logout(): void {
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
    }

    public getExpiration(): any {
        const expiration = localStorage.getItem('expires_at') + "";
        const expiresAt = JSON.parse(expiration);
        return moment(expiresAt);
    }

    private handleError(error: any): void {
        console.log(error);
    }

    public getUser(): string {
      const jwt = localStorage.getItem('id_token');
      let obj = jwt_decode.default(jwt);
      return obj['name'];
    }
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

interface Penpal {
  user: string,
  penpal: string
}
