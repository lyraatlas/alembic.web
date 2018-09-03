import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { CONST } from '../constants';
import { environment } from '../environments/environment';
import { IBucket } from '../models';
import { BaseService } from './base/base.service';
import { CommentableServiceMixin } from './mixins/commentable.service.mixin';
import { LikeableServiceMixin } from './mixins/likeable.service.mixin';

@Injectable()
export class BucketService extends BaseService<IBucket>{

    public liker = new LikeableServiceMixin();
    public commenter = new CommentableServiceMixin();

    constructor(public http: Http) {
        super(http, {
            rootApiUrl: `${environment.apiEndpoint}${environment.V1}`,
            urlSuffix: CONST.ep.BUCKETS
        });

        this.liker.service = this;
        this.commenter.service = this;
     }

}
