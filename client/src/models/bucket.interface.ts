import * as enums from "../enumerations";
import { IBaseModel, IBucketItem, ICommentable, IHasImages, ILikeable, IOwned, ITimeStamped } from "./index";

export interface IBucket extends IBaseModel, ILikeable, IOwned, ITimeStamped, ICommentable, IHasImages {

    name?: string,
    description?: string,
    bucketItems?: IBucketItem[],
    type?: enums.BucketType,
    href?: string,
    
}
