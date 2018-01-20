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

@Injectable()
export class AuthenticationService extends BaseService<IUser>{
    constructor(public http: Http) {
        super(http, {
            rootApiUrl: `${environment.IdentityAPIBase}${environment.V1}`,
            urlSuffix: 'users'
        });
    }

    login(email: string, password: string): Observable<Response> {
        return this.post(CONST.ep.AUTHENTICATE, { email: email, password: password }).map((response: Response) => {
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

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem(CONST.CLIENT_TOKEN_LOCATION);
        localStorage.removeItem(CONST.CLIENT_DECODED_TOKEN_LOCATION);
    }
}
