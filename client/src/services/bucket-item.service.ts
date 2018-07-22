import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from '../../node_modules/rxjs';
import { CONST } from '../constants';
import { environment } from '../environments/environment';
import { IBucketItem } from '../models';
import { BaseService } from './base/base.service';
import { CommentableServiceMixin } from './mixins/commentable.service.mixin';
import { LikeableServiceMixin } from './mixins/likeable.service.mixin';

@Injectable()
export class BucketItemService extends BaseService<IBucketItem>{
    
    public liker = new LikeableServiceMixin();
    public commenter = new CommentableServiceMixin();

    constructor(public http: Http) {
        super(http, {
            rootApiUrl: `${environment.apiEndpoint}${environment.V1}`,
            urlSuffix: CONST.ep.BUCKET_ITEMS
        });
        
        this.liker.service = this;
        this.commenter.service = this;
     }

     public uploadImage(file: File, id: string) : Observable<IBucketItem>{

        let formData:FormData = new FormData();

        formData.append('file', file);

        this.requestOptions.headers.set(`Content-Type`, 'multipart/form-data');
        this.requestOptions.headers.delete(`Content-Type`);

        //http://localhost:9000/api/v1//bucket-items/images/5b54ea219902925b0be2301e
        return this.http.post(`${this.buildUrl({operation: '/images'})}/${id}`, formData, this.requestOptions)
            .map(res => {
                return res.json();
            })
            .catch(this.handleError);
     }
}