import * as enums from "../enumerations";

export interface IOwned {
    owners?: {
        ownerId: string,
        ownershipType: enums.OwnershipType
    }[]
}