import { IBaseModel } from "../index";
import * as enums from "../../enumerations";
import * as log from 'winston';

export interface INotification extends IBaseModel {
    _id?: string,
    __v?: number,
    type?: enums.NotificationType
    // This field makes it easier to build our notification list.  in the supplier mobile app, and taki dashboard.
    relatedTo?: string,
    isRead?: boolean;
    readAt?: string;
    isActionable?: boolean;
    isActionCompleted?: boolean;
    isSystem?: boolean;
}

