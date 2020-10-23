import { Injectable } from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {Observable, throwError } from 'rxjs'
import { tap, shareReplay } from 'rxjs/operators';
import * as moment from "moment";

interface User {
  email: String
  password: String
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(email, password): Observable<any> {
    return this.http.post('http://127.0.0.1:5000/api/accounts/login?include_auth_token', {email, password})
      .pipe(tap((res:Object) => {
        shareReplay();
        console.log("Got response from login: "+JSON.stringify(res));
        var auth_token: string = (res as any).response.user.authentication_token;
        console.log("Extracted token: "+ auth_token);
        localStorage.setItem('id_token', auth_token);
        
      }));
  }
      

  logout() {
      localStorage.removeItem("id_token");
      localStorage.removeItem("expires_at");
  }

  public isLoggedIn() {
      return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
      return !this.isLoggedIn();
  }

  getExpiration() {
      const expiration = localStorage.getItem("expires_at");
      const expiresAt = JSON.parse(expiration);
      return moment(expiresAt);
  }    

}
