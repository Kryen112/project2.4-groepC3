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
    
    login(name:string, password:string ) {
        return this.http.post<User>(API_URL+'login', {name, password})
            .pipe (
                tap ( 
                    res => this.setSession(res),
                    err => this.handleError(err),
                ),
                shareReplay()
            )
    }

    public isLoggedIn() {
        return moment().isBefore(this.getExpiration());
    }

    private setSession(authResult: any) {
        console.log("Setting session");

        const expiresAt = moment().add(authResult.expiresIn, 'milliseconds');

        localStorage.setItem('id_token', authResult.token);
        localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
    }

    public logout() {
        console.log("Logging out");

        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
    }

    public getExpiration() {
        console.log("Get experiation as json...");

        const expiration = localStorage.getItem('expires_at') + "";
        const expiresAt = JSON.parse(expiration);

        return moment(expiresAt);
    } 

    private handleError(error: any) {
        console.error("ERROR...");
        console.log(error);
    }
}

interface User {
    name:string,
    password:string,
}
