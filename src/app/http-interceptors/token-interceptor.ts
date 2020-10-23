import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders
} from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable()
export class NoopInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>,
        next: HttpHandler): Observable<HttpEvent<any>> {
        
        //console.log("Parameters of request at interception: "+req.params);

        const idToken = localStorage.getItem("id_token");
        const guestJwt = localStorage.getItem("guestJwt");
        //console.log("Http request intercepted with token: "+ idToken);
        console.log("Http request intercepted with GUEST token: "+ guestJwt);
        
        var headers: HttpHeaders = req.headers
        
        if (guestJwt) {
            headers = headers.set("Guest-Authentication-Token", guestJwt);
        }
        if (idToken) {
            headers =  headers.set("Authentication-Token", idToken);
        }
        
        const cloned = req.clone({headers: headers});
        
        return next.handle(cloned);
    }
}