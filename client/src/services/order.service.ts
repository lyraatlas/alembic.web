import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { BaseService } from './base/base.service';
import { CONST } from '../constants';
import { IOrder } from '../models/index';
import { environment } from '../environments/environment';
import { MimeType, OrderStatus } from '../enumerations';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class OrderService extends BaseService<IOrder>{
    constructor(public http: Http) {
        super(http, {
            rootApiUrl: `${environment.ProductAPIBase}${environment.V1}`,
            urlSuffix: 'orders'
        });
     }

     public send(order: IOrder): Observable<IOrder>{
        console.log(`About to send an order`);
        return this.http.patch(`${this.serviceConfig.rootApiUrl}/${this.serviceConfig.urlSuffix}${CONST.ep.SEND}/${order._id}`
                , order
                ,this.requestOptions)
                .map((res: Response)=>{
                    return res.json();
                }).catch(this.handleError);
     }

        //  export enum OrderStatus{
        //     entered = 1,
        //     sent = 2,
        //     accepted = 3,
        //     rejected = 4,
        //     pickedUp = 5,
        //     delivered = 6,
        //     completed = 7
        // }
     public moveOrderForward(order:IOrder, destinationStatus: OrderStatus): Observable<IOrder>{
         order.status = destinationStatus;
         switch (+destinationStatus) {
            // from accepted to sent
            case OrderStatus.sent:
                return this.changeOrderStatus(order,CONST.ep.SEND);
             // from sent to accepted
             case OrderStatus.accepted:
                return this.changeOrderStatus(order,CONST.ep.ACCEPT);
            // From sent to rejected.
            case OrderStatus.rejected:
                return this.changeOrderStatus(order,CONST.ep.REJECT);
            // from accepted to picked up
            case OrderStatus.pickedUp:
                return this.changeOrderStatus(order,CONST.ep.PICKUP);
            // from picked up to delivered
            case OrderStatus.delivered:
                return this.changeOrderStatus(order,CONST.ep.DELIVER);
            // from picked up to delivered
            case OrderStatus.completed:
                return this.changeOrderStatus(order,CONST.ep.COMPLETE);
             default:
                 break;
         }
     }

     private changeOrderStatus(order:IOrder, endpoint: string):Observable<IOrder>{
        return this.http.patch(
            `${this.serviceConfig.rootApiUrl}/${this.serviceConfig.urlSuffix}${endpoint}/${order._id}`,
            order,
            this.requestOptions
        )
        .map((res: Response)=>{
            return res.json();
        }).catch(this.handleError);
     }
}