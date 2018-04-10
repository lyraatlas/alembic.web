import * as enums from "../enumerations";

export interface IOwned {
    owners?: Array<IOwner>;
}

export interface IOwner{
    ownerId: string,
    ownershipType: enums.OwnershipType
}