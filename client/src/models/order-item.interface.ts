import { IBaseModel, IAddress, IContact, IEmail,IPhone, ISupplier, IProduct } from "./index";
import * as enums from "../enumerations";

export interface IOrderItem extends IBaseModel {
    _id?: string,
    __v?: number,
    product?: IProduct | string,
    quantity?: number,
    price?: number,
}
