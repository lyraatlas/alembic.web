import { IBaseModel } from "./base/base-model.interface";

export interface IUser extends IBaseModel{
    email?: string,
    password?: string,
    firstName?: string,
    lastName?   : string,
    isEmailVerified?: boolean,
    facebookAuth?: object,
}