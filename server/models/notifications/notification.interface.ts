import { mongoose } from '../../config/database/database';
import { Schema, Model, Document, model } from 'mongoose';
import { IBaseModel, IBaseModelDoc, IUser, IBucket, IBucketItem } from "../index";
import * as enums from "../../enumerations";
import { BijectionEncoder } from '../../utils/bijection-encoder';
import * as log from 'winston';
import { IOwned } from '../owned.interface';

export interface INotification extends IBaseModel, IOwned {
    type: enums.NotificationType
    bucket?: IBucket | string,
    bucketItem?: IBucketItem | string,
    createdBy?: IUser | string,
    notifiedBy?: IUser | string,
    isRead?: boolean;
    readAt?: string;
    isActionable?: boolean;
    isActionCompleted?: boolean;
    isSystem?: boolean;
}

export interface INotificationDoc extends INotification, IBaseModelDoc {

}

export const NotificationSchema = new Schema({
    bucket: { type: Schema.Types.ObjectId, ref: 'bucket' },
    bucketItem: { type: Schema.Types.ObjectId, ref: 'bucketItem' },
    // This could be supplier, courier, particular team member, or user.  We're going to keep this generic for now.
    type: { type: Number, enum: [enums.EnumHelper.getValuesFromEnum(enums.NotificationType)] },
    notifiedBy: { type: Schema.Types.ObjectId, ref: 'user' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'user' },
    isRead: { type: Boolean, default: false },
    readAt: { type: String },
    isActionable: { type: Boolean },
    isActionCompleted: { type: Boolean },
    isSystem: { type: Boolean },
}, { timestamps: true });

// This will compile the schema for the object, and place it in this Instance.
export const Notification = mongoose.model<INotificationDoc>('notification', NotificationSchema);   
