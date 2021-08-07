import { Component } from '@angular/core';
import { version } from "../version";
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  constructor(private oauthService: OAuthService) {
    console.log("Vocabulary front end version: " + version.number);
        
    this.oauthService.configure(authCodeFlowConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  title = 'Vocabulary quiz demo';

  showDemo: boolean = false;

  showDemoFunc() {
    this.showDemo = false;
  }

  public login() {
    this.oauthService.initLoginFlow();
  }

  public logout() {
      this.oauthService.logOut();
  }

  public get userName() {

      var claims = this.oauthService.getIdentityClaims();

      console.log(`Claims: ${JSON.stringify(claims)}`)

      if (!claims) return null;

      return claims["cognito:username"];
  }

}


export const authCodeFlowConfig: AuthConfig = {
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