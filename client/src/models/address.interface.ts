import * as enums from "../enumerations";


export interface IAddress {
    street1?: string,
    street2?: string,
    city?: string,
    state?: string,
    country?: string,
    province?: string,
    countryCode?: string,
    zip?: string,
    type?: enums.AddressType
}