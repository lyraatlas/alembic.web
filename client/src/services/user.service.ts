import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CONST } from '../constants';
import { environment } from '../environments/environment';
import { ITokenPayload, IUser } from '../models';
import { BaseService } from './base/base.service';

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

  public static getCurrentUserId(): string {
    return (JSON.parse(localStorage.getItem(CONST.CLIENT_DECODED_TOKEN_LOCATION)) as ITokenPayload).userId;
  }

}
