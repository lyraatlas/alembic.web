import { IBaseModel, ILikeable, IOwned, ITimeStamped, IBucketItem, ICommentable, IHasImages } from "./index";
import * as enums from "../enumerations";

export interface IBucket extends IBaseModel, ILikeable, IOwned, ITimeStamped, ICommentable, IHasImages {
    name?: string,
    description?: string,
    bucketItems?: IBucketItem[],
    type?: enums.BucketType,
    href?: string,
}
