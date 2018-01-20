import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { AppError } from '../classes/app-error.class';
import { AlertService } from '../services/index';
import { IOrderItem } from '../models';
import { IOrder } from '../models/index';
import { OrderItemEventType } from '../enumerations';

export interface IOrderItemEventMessage{
    orderItem: IOrderItem,
    eventType: OrderItemEventType,
    relatedOrder: IOrder,
}

@Injectable()
export class OrderItemEventBus {
    private orderItemChangedSource = new Subject<IOrderItemEventMessage>();
    
    public orderItemChanged$ = this.orderItemChangedSource.asObservable();

    constructor(private alertService: AlertService){};

    public addNewOrderItem(orderItem: IOrderItem, order: IOrder) {
        this.emitMessage(orderItem,OrderItemEventType.newAdded, order);
    }

    public editOrderItem(orderItem: IOrderItem, order: IOrder){
        this.emitMessage(orderItem,OrderItemEventType.edited, order);
    }

    public removeOrderItem(orderItem: IOrderItem, order: IOrder) {
        this.emitMessage(orderItem,OrderItemEventType.removed, order);
    }

    public saveOrderItem(orderItem: IOrderItem, order: IOrder){
        this.emitMessage(orderItem,OrderItemEventType.saved, order);
    }
    
    private emitMessage(orderItem: IOrderItem, eventType: OrderItemEventType, order: IOrder){
        this.orderItemChangedSource.next({
            eventType: eventType,
            orderItem: orderItem,
            relatedOrder: order
        })
    }
}