import { Injectable, OnInit } from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject, throwError } from 'rxjs'
import { tap, shareReplay } from 'rxjs/operators';
import * as moment from "moment";
import { environment } from 'src/environments/environment';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';

export interface User {
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private oauthService: OAuthService) {
    this.user$ = new BehaviorSubject(null);
  }

  public user$: BehaviorSubject<User>;

  public init() {
    this.oauthService.configure(this.authCodeFlowConfig);
    console.log("init - starting login")
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then((isLoginSuccessful) => {
      var claims = this.oauthService.getIdentityClaims();
      console.log("init - login finished with claims "+JSON.stringify(claims))
      if (!claims) {
        console.warn("Logging in was not successful!")
      }
      else {
        const user: User = {username: claims["cognito:username"]};
        this.user$.next(user);
      } 
    });
  }

  public login() {
    this.oauthService.initLoginFlow();
    //window.location.reload();
  }

  public logout() {
    this.oauthService.logOut();
    window.location.reload();
  }

  authCodeFlowConfig: AuthConfig = {
    // Url of the Identity Provider
    issuer: environment.oauthIssuer,
  
    // URL of the SPA to redirect the user to after login
    redirectUri: environment.oauthRedirectUri,
  
    // The SPA's id. The SPA is registerd with this id at the auth-server
    // clientId: 'server.code',
    clientId: environment.oauthClientId,
  
    // Just needed if your auth server demands a secret. In general, this
    // is a sign that the auth server is not configured with SPAs in mind
    // and it might not enforce further best practices vital for security
    // such applications.
    //dummyClientSecret: 'secret',
  
    responseType: 'token',
  
    // set the scope for the permissions the client should request
    // The first four are defined by OIDC.
    // Important: Request offline_access to get a refresh token
    // The api scope is a usecase specific one
  
    showDebugInformation: environment.oauthShowDebugInformation,
  
    strictDiscoveryDocumentValidation: false,
  
  };

}
