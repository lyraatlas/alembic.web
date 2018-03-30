import { IBucketDoc, Bucket, ITokenPayload, IBaseModel, IBucket, IBaseModelDoc, ILikeable, INotificationDoc, IOwned, INotification, BucketItem } from '../../models';
import { Router, Request, Response, RequestParamHandler, NextFunction, RequestHandler } from 'express';
import mongoose = require('mongoose');
import { Schema, Model, Document } from 'mongoose';
import { BaseController } from '../base/base.controller';
import { CONST } from '../../constants';
import { BucketRepository, NotificationRepository } from "../../repositories";
import { OwnershipType, NotificationType } from "../../enumerations";
import { ICommentable } from '../../models/commentable.interface';

export class NotificationUtility {

    public static async addNotification(notificationType: NotificationType, item: IBaseModelDoc, currentToken:ITokenPayload) {
        // Now we also want to notify the owner of this item.  So we're going to add a notification for 
        // that user that someone added a comment on their item.
        let owned = item as IOwned;

        let owners = owned.owners.find(owner => {
            return owner.ownershipType == OwnershipType.user;
        });

        // now in theory there is going to be multiple owners.  In practice this isn't really true though. 
        let notificationRepo = new NotificationRepository();

        let notification: INotification = {
            type: notificationType,
            isActionable: false,
            isRead: false,
            notifiedBy: currentToken.userId,
            createdBy: owners.ownerId,
            isSystem: false,
        }

        switch (+notificationType) {
            case NotificationType.BucketCommentAded:
            case NotificationType.BucketLiked:
                    notification.bucket = item.id;
                break;
            case NotificationType.BucketItemCommentAdded:
            case NotificationType.BucketItemLiked:
                notification.bucketItem = item.id;
                break;
            default:
                break;
        }

        let notificationDoc = notificationRepo.createFromInterface(notification);

        await notificationRepo.save(notificationDoc);
    }
}
