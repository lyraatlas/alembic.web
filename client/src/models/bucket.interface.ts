import { IBaseModel, IBucketItem, ICommentable, IHasImages, ILikeable, IOwned, ITimeStamped } from ".";
import * as enums from "../enumerations";

export interface IBucket extends IBaseModel, ILikeable, IOwned, ITimeStamped, ICommentable, IHasImages {

    name?: string,
    description?: string,
    bucketItems?: string[] | IBucketItem[],
    type?: enums.BucketType,
    href?: string,
    
}
