import { IBaseModel } from "./index";
import * as enums from "../enumerations";


export interface IEmail {
    email: string,
    type: enums.EmailType
}