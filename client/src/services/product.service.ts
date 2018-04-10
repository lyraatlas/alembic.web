import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { BaseService } from './base/base.service';
import { CONST } from '../constants';
import { IProduct } from '../models/index';
import { environment } from '../environments/environment';
import { MimeType } from '../enumerations';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProductService extends BaseService<IProduct>{
    constructor(public http: Http) {
        super(http, {
            rootApiUrl: `${environment.apiEndpoint}${environment.V1}`,
            urlSuffix: 'products'
        });
     }

     createActiveProductFromTemplate(productId: string): Observable<IProduct>{
        console.log(`About to create a product from a template`);
        return this.http
        .post(`${this.serviceConfig.rootApiUrl}/${this.serviceConfig.urlSuffix}/${productId}`, null, this.requestOptions)
        .map((res: Response) => {
            return res.json();
        }).catch(this.handleError);
     }

    //  deleteProductImage(productId:string, imageId: string): Observable<Response> {
    //     console.log(`About to delete image: ${imageId}`);
    //     return this.http
    //     .delete(`${this.serviceConfig.rootApiUrl}/${this.serviceConfig.urlSuffix}${CONST.ep.DELETE_IMAGE}/${productId}/${imageId}`, this.requestOptions)
    //     .map((res: Response) => {
    //         return res.json();
    //     }).catch(this.handleError);
    // }
}
