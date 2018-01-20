import { IBaseModel } from "./index";
import * as enums from "../enumerations";

export interface IPhone {
    phone: string,    
    type: enums.PhoneType
}