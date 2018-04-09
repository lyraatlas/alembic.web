import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { BaseService } from './base/base.service';
import { CONST } from '../constants';
import { INotification } from '../models/index';
import { environment } from '../environments/environment';
import { MimeType, OrderStatus } from '../enumerations';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class NotificationService extends BaseService<INotification>{
    constructor(public http: Http) {
        super(http, {
            rootApiUrl: `${environment.apiEndpoint}${environment.V1}`,
            urlSuffix: 'notifications'
        });
     }
}