import { IBaseModel, IAddress, IContact, IEmail,IPhone } from "./index";
import * as enums from "../enumerations";


export interface ISupplier extends IBaseModel {
    _id?: string,
    __v?: number,
    ownerships?: {
        ownerId: string,
        ownershipType: enums.OwnershipType
    }[],
    name?:string,
    slug?:string,
    companyEmail?: string,
    companyPhone?: string,
    companyAddress?: IAddress,
    pickupAddress?: IAddress,
    pickupName?: string,
    pickupPhone?: string,
    pickupEmail?: string,
    isApproved?: boolean,
    isActive?: boolean,
    href?:string,
}
