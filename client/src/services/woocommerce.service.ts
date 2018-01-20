import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { BaseService } from './base/base.service';
import { CONST } from '../constants';
import { IOrder } from '../models/index';

import { environment } from '../environments/environment';
import { MimeType } from '../enumerations';
import { Observable } from 'rxjs/Observable';
import { Order, Customer, Product } from '../models/woo/index';

@Injectable()
export class WooCommerceService extends BaseService<Order>{
    constructor(public http: Http) {
        super(http, {
            rootApiUrl: `${environment.WooApiLocation}`,
            urlSuffix: 'orders'
        });
     }

     public getOrder(id: number): Observable<Order>{
        return this.single<Order>(id, '/orders');
     }

     public getCustomer(id: number): Observable<Customer>{
        return this.single<Customer>(id, '/customers');
     }

     public getProduct(id: number): Observable<Product>{
        return this.single<Product>(id, '/products');
     }

     private single<T>(id: number, endpoint: string) : Observable<T>{
        let headers = new Headers();
        if(environment.production == false){
            headers.append("Authorization", "Basic " + btoa(environment.WooStagingUser + ":" + environment.WooStagingPass)); 
            headers.append("Content-Type", "application/x-www-form-urlencoded");
        }
        headers.append('x-access-token',localStorage.getItem(CONST.CLIENT_TOKEN_LOCATION));

        let url = `/woo/${environment.WooApiLocation}${endpoint}/${id}?consumer_key=${environment.WooConsumerKey}&consumer_secret=${environment.WooConsumerSecret}`
        console.log(`About to send a woo request to: ${url}`);
        //console.dir(params.getAll('consumer_key'));
        return this.http
            .get(url,{
                headers: headers,
            })
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
     }
}