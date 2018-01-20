import { Notification, INotificationDoc } from "../models/index";
import { Model } from "mongoose";
import { BaseRepository } from "./index";

export class NotificationRepository extends BaseRepository<INotificationDoc>{
    protected mongooseModelInstance: Model<INotificationDoc> = Notification;
    
    public constructor() {
        super();
    }
}