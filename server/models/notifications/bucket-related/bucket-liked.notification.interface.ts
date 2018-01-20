import { IBucketNotificationBase } from "./bucket-notification-base.interface";

export interface IBucketLikedNotification extends IBucketNotificationBase{
    likedBy: string;
}