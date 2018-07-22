import { IAddress, IBaseModel, IEmail, IPhone } from ".";
import * as enums from "../enumerations";


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
