import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { BaseService } from './base/base.service';
import { CONST } from '../constants';
import { IUser } from '../models/index';
import { environment } from '../environments/environment';
import { MimeType } from '../enumerations';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService extends BaseService<IUser>{

    constructor(public http: Http) {
        super(http, {
            rootApiUrl: `${environment.apiEndpoint}${environment.V1}`,
            urlSuffix: 'users'
        });
     }

     //(this.user.id, this.user.password,this.passwordNewValue)
     updateUserPassword(userId: string, oldPassword: string, newPassword: string): Observable<IUser> {
        const url = this.buildUrl({ id: userId, operation: CONST.ep.INLINE_PASSWORD_CHANGE });
        console.log(url);
        return this.http
            .patch(url, {
                oldPassword: oldPassword,
                newPassword: newPassword
            }, this.requestOptions)
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }
}
