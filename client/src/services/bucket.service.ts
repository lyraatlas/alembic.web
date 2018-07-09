import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CONST } from '../constants';
import { environment } from '../environments/environment';
import { IBucket } from '../models/index';
import { BaseService } from './base/base.service';

@Injectable()
export class BucketService extends BaseService<IBucket>{
    constructor(public http: Http) {
        super(http, {
            rootApiUrl: `${environment.apiEndpoint}${environment.V1}`,
            urlSuffix: CONST.ep.BUCKETS
        });
     }

     addLike(item: IBucket): Observable<IBucket>{
        return this.http
        .patch(`${this.serviceConfig.rootApiUrl}/${this.serviceConfig.urlSuffix}${CONST.ep.LIKES}/${item._id}`, {}, this.requestOptions)
        .map((res: Response) => {
            return res.json();
        }).catch(this.handleError);
     }

     removeLike(item: IBucket): Observable<IBucket>{
        return this.http
        .delete(`${this.serviceConfig.rootApiUrl}/${this.serviceConfig.urlSuffix}${CONST.ep.LIKES}/${item._id}`, this.requestOptions)
        .map((res: Response) => {
            return res.json();
        }).catch(this.handleError);
     }

     addComment(item: IBucket, comment: string): Observable<IBucket>{
        return this.http
        .post(`${this.serviceConfig.rootApiUrl}/${this.serviceConfig.urlSuffix}${CONST.ep.COMMENTS}/${item._id}`, {comment: comment}, this.requestOptions)
        .map((res: Response) => {
            return res.json();
        }).catch(this.handleError);
     }
}
