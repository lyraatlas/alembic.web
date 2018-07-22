import { IProduct, ISupplier } from "..";

export interface IPriceUpdatedNotification{
    updatedPrice: string,
    product: IProduct,
    supplier: ISupplier,
    updatedAt: string,
}