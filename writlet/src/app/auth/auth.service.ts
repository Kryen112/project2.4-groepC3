import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { shareReplay, tap } from 'rxjs/operators'

import * as moment from 'moment';
import * as jwt_decode from 'jwt-decode';

const API_URL = 'http://localhost:5000/api/'

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private http: HttpClient) {
    }

    login(name:string, password:string) {
        return this.http.post<User>(API_URL+'login', {name, password})
            .pipe (
                tap (
                    res => this.setSession(res),
                    err => this.handleError(err),
                ),
                shareReplay()
            );
    }

    register(name:string, password:string, penpalList: Array<string>) {
      return this.http.post<User>(API_URL+'register', {name, password, penpalList})
            .pipe (
                tap (
                    res => this.setUser(res),
                    err => this.handleError(err),
                ),
                shareReplay()
            );
    }

    friend(user:string, friend:string) {
      return this.http.post<Friend>(API_URL + 'friendlist', {user, friend})
        .pipe(
          tap(
            res => this.getFriend(res),
            err => this.handleError(err),
          ),
          shareReplay()
      );
    }

    addPenPal(user: string, penpal: string) {
      console.log("addpenpal in authservice");
      return this.http.post<Penpal>(API_URL + 'penpals', {user, penpal})
        .pipe(
          tap(
            res => this.getFriend(res),
            err => this.handleError(err),
          ),
          shareReplay()
      );
    }

    private getFriend(authResult: any) {
      return authResult;
    }

    private setUser(authResult: any) {
      return authResult;
    }

    public isLoggedIn() {
        return moment().isBefore(this.getExpiration());
    }

    private setSession(authResult: any) {
        const expiresAt = moment().add(authResult.expiresIn, 'milliseconds');
        localStorage.setItem('id_token', authResult.token);
        localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
    }

    public logout() {
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
    }

    public getExpiration() {
        const expiration = localStorage.getItem('expires_at') + "";
        const expiresAt = JSON.parse(expiration);
        return moment(expiresAt);
    }

    private handleError(error: any) {
        console.log(error);
    }

    public getUser() {
      const jwt = localStorage.getItem('id_token');
      let obj = jwt_decode.default(jwt);
      return obj["name"];
    }
}

interface User {
    name: string,
    password: string,
}

interface Friend {
  user: string,
  friend: string
}

interface Penpal {
  user: string,
  penpal: string
}
