import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { BaseService } from './base/base.service';
import { CONST } from '../constants';
import * as jwtDecode from 'jwt-decode';
import { IUser } from '../models/user.interface';
import { environment } from '../environments/environment';
import { MimeType } from '../enumerations';

declare const FB: any;

@Injectable()
export class AuthenticationService extends BaseService<IUser>{

    constructor(public http: Http) {
        super(http, {
            rootApiUrl: `${environment.apiEndpoint}${environment.V1}`,
            urlSuffix: ''
        });

        FB.init({
            appId: '158132754979085',
            status: false, // the SDK will attempt to get info about the current user immediately after init
            cookie: false,  // enable cookies to allow the server to access
            xfbml: false,  // With xfbml set to true, the SDK will parse your page's DOM to find and initialize any social plugins that have been added using XFBML
            version: 'v2.8' // use graph api version 2.5
        });
    }

    public loginFacebook(): Promise<any> {
        return new Promise((resolve, reject) => {
            FB.login((result) => {
                console.log(`Facebook login result: ${result.authResponse.accessToken}`);

                if(result.authResponse){
                    this.http.post(
                                `${environment.apiEndpoint}${environment.V1}${CONST.ep.AUTHENTICATE}${CONST.ep.FACEBOOK}`,
                                { access_token: result.authResponse.accessToken },
                                this.requestOptions
                            )
                            .toPromise()
                            .then((response) => {
                                let userLoginResponse = response.json();
                                if (userLoginResponse && userLoginResponse.token) {
                                    //console.log(`Heres the response back from the server ${JSON.stringify(userLoginResponse)}`);
                                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                                    // we're going to take on email to the 'token' so we can display it.
                                    let decodedToken = jwtDecode(userLoginResponse.token);
                                    localStorage.setItem(CONST.CLIENT_DECODED_TOKEN_LOCATION, JSON.stringify(decodedToken));
                                    localStorage.setItem(CONST.CLIENT_TOKEN_LOCATION, userLoginResponse.token);
                                    console.log(JSON.stringify(decodedToken));
                                    resolve(userLoginResponse);
                                } else{
                                    reject('There was a problem getting a token back from the server on facebook login.');
                                } 
                            }).catch(this.handleError);   
                } else {
                    reject('There was a problem getting a token back from the server on facebook login.');
                }
            }, { scope: 'public_profile,email' });
        });
    }

    public loginLocal(email: string, password: string): Observable<Response> {
        return this.post(`${CONST.ep.AUTHENTICATE}${CONST.ep.LOCAL}${CONST.ep.LOGIN}`, { email: email, password: password }).map((response: Response) => {
            // login successful if there's a jwt token in the response
            let user = response.json();
            if (user && user.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                // we're going to take on email to the 'token' so we can display it.
                let tokenObj = jwtDecode(user.token);
                tokenObj.email = email;
                localStorage.setItem(CONST.CLIENT_DECODED_TOKEN_LOCATION, JSON.stringify(tokenObj));
                localStorage.setItem(CONST.CLIENT_TOKEN_LOCATION, user.token);
                console.log(JSON.stringify(tokenObj));
                return user;
            }
        });
    }

    protected post(endpoint: string, object: any): Observable<Response> {
        return this.http
            .post(`${this.serviceConfig.rootApiUrl}${endpoint}`, object, new RequestOptions({
                headers: new Headers({ 'Content-Type': MimeType.JSON })
            }))
            .map((res: Response) => {
                return res;
            }).catch(this.handleError);
    }

    public logout() {
        // remove user from local storage to log user out
        localStorage.removeItem(CONST.CLIENT_TOKEN_LOCATION);
        localStorage.removeItem(CONST.CLIENT_DECODED_TOKEN_LOCATION);
    }
}
