import { IBaseModel, IAddress } from "./index";
import * as enums from "../enumerations";
import { IImage, IPhone, IEmail } from './';


export interface IContact extends IBaseModel {
    firstName: string,
    lastName: string,
    type: enums.ContactType,
    emails: IEmail[],
    addresses: IAddress[],
    phones: IPhone[],
    createdBy?: string;
    modifiedBy?: string;
    createdAt?: Date,
    modifiedAt?: Date,
}
