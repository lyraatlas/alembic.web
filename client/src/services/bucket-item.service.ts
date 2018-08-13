import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from '../../node_modules/rxjs';
import { UploadFile } from '../classes/upload-file.class';
import { UploadResponse } from '../classes/upload-response.class';
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

  public removeFromBucket(bucketItemId: string, bucketId: string): Observable<string> {

    this.requestOptions.body = {
      bucketId: bucketId,
      buckItemId: bucketItemId
    };

    const deleted =  this.http.delete(`${this.buildUrl({ operation: CONST.ep.REMOVE_REFERENCES })}/${bucketItemId}`, this.requestOptions)
      .map(res => {
        return res.json();
      })
      .catch(this.handleError);

     this.requestOptions.body = undefined;

     return deleted;
  }

  public uploadImage(relatedImageUpload: UploadFile, bucketItemId: string): Observable<UploadResponse> {

    let formData: FormData = new FormData();

    formData.append('file', relatedImageUpload.file);

    this.requestOptions.headers.set(`Content-Type`, 'multipart/form-data');
    this.requestOptions.headers.delete(`Content-Type`);

    //http://localhost:9000/api/v1//bucket-items/images/5b54ea219902925b0be2301e
    return this.http.post(`${this.buildUrl({ operation: '/images' })}/${bucketItemId}`, formData, this.requestOptions)
      .map(res => {
		  return {
			bucketItem: res.json(),
			uploadFile: relatedImageUpload
		  } as UploadResponse;
      })
      .catch(this.handleError);
  }
}
