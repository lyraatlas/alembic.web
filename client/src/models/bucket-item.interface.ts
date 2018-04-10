import { IBaseModel, ILikeable, IOwned, ITimeStamped, IBucketItem, ICommentable, IHasImages, IHasLocation } from "./index";
import * as enums from "../enumerations";

export interface IBucketItem extends IBaseModel, ILikeable, IOwned, ITimeStamped, ICommentable, IHasImages, IHasLocation {
    name?: string,
    description?: string,
    href?: string,
}