import { IBaseModel, IAddress, IContact, IEmail,IPhone, ISupplier, IOrderItem } from "./index";
import * as enums from "../enumerations";


export interface IOrder extends IBaseModel {
    _id?: string,
    __v?: number,
    ownerships?: {
        ownerId: string,
        ownershipType: enums.OwnershipType
    }[],
    orderNumber?: number,
    code?: string,
    status: enums.OrderStatus,
    wooOrderNumber?: string,
    wooCustomerId?: string,
    supplier?: ISupplier | string,
    subtotal?: number,
    tax?: number,
    total?: number,
    notes?: string,
    itemsHash?: string,
    items?: Array<IOrderItem>,
    href?: string,
}
