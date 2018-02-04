import { IBucketItemNotificationBase } from "./bucket-item-notification-base.interface";

export interface IBucketItemLikedNotification extends IBucketItemNotificationBase{
    likedBy: string;
}