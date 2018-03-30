import { IUser } from ".";

export interface ITimeStamped{
    createdBy?: string | IUser;
    modifiedBy?: string| IUser;
    createdAt?: Date,
    modifiedAt?: Date,
}