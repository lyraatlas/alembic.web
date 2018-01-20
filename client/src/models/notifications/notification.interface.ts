import { IBaseModel } from "../index";
import * as enums from "../../enumerations";
import * as log from 'winston';
import { INewOrderNotification } from './order-related/new-order.notification.interface';
import { IOrderAcceptedNotification } from './order-related/order-accepted.notification.interface';
import { IPriceUpdatedNotification } from './price-updated.notification.interface';
import { IOrderRejectedNotification } from './order-related/order-rejected.notification.interface';

export interface INotification extends IBaseModel {
    _id?: string,
    __v?: number,
    type?: enums.NotificationType
    newOrderNotification?: INewOrderNotification,
    orderAcceptedNotification?: IOrderAcceptedNotification,
    orderRejectedNotification?: IOrderRejectedNotification,
    priceUpdatedNotification?: IPriceUpdatedNotification,
    // This field makes it easier to build our notification list.  in the supplier mobile app, and taki dashboard.
    relatedTo?: string,
    isRead?: boolean;
    readAt?: string;
    isActionable?: boolean;
    isActionCompleted?: boolean;
    isSystem?: boolean;
}

