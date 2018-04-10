import * as enums from "../enumerations";
import { OwnershipType } from "../../client/src/enumerations";

export interface IOwned {
    owners?: Array<IOwner>;
}

export interface IOwner{
    ownerId: string,
    ownershipType: enums.OwnershipType
}