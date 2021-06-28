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

    register(name:string, password:string) {
      return this.http.post<User>(API_URL+'register', {name, password})
            .pipe (
                tap (
                    res => this.setUser(res),
                    err => this.handleError(err),
                ),
                shareReplay()
            );
    }
    //getFriend vervangen door de functie die checkt of de user bestaat :)
    user(user: string) {
      return this.http.get<any[]>(API_URL+'users/'+user)
        .pipe(
          tap(
            res => this.userExists(res),
            err => this.handleError(err),
          ),
          shareReplay()
      );
    }

    userInfo(user: string) {
      return this.http.get<any[]>(API_URL+'userinfo/'+user)
        .pipe(
          tap(
            res => this.getInformation(res),
            err => this.handleError(err),
          ),
          shareReplay()
        );
    }

    private getInformation(authResult: any) {
      return authResult;
    }

    userUpdated(name:string, oldname:string, password:string) {
      return this.http.post<UserUpdate>(API_URL+'userupdate', {name, oldname, password})
        .pipe (
          tap (
            res => this.userExists(res),
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
            res => this.userExists(res),
            err => this.handleError(err),
          ),
          shareReplay()
      );
    }

    private userExists(authResult: any) {
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

interface UserUpdate {
  name: string,
  oldname: string,
  password: string,
}

interface Penpal {
  user: string,
  penpal: string
}
