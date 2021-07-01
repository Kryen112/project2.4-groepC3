import { Injectable } from '@angular/core'
import { HttpHeaders, HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(private http: HttpClient) {
  }

public header(): { headers: HttpHeaders } {
  return {
          headers: new HttpHeaders()
          .set('Authorization',  `Bearer ${localStorage.getItem('id_token')}`)
    };
  }

  public isLoggedIn(): boolean  {
      return moment().isBefore(this.getExpiration());
  }

  public setSession(authResult: any): void {
      const expiresAt = moment().add(authResult.expiresIn, 'milliseconds');
      localStorage.setItem('id_token', authResult.token);
      localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  public logout(): void {
      localStorage.removeItem('id_token');
      localStorage.removeItem('expires_at');
  }

  public getExpiration(): any {
      const expiration = localStorage.getItem('expires_at') + '';
      const expiresAt = JSON.parse(expiration);
      return moment(expiresAt);
  }

  public getUser(): string {
    const jwt = localStorage.getItem('id_token');
    let obj = jwt_decode.default(jwt);
    return obj['name'];
  }
}
