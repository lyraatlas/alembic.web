import { IBaseModel, ICommentable, IHasImages, IHasLocation, ILikeable, IOwned, ITimeStamped } from ".";

export interface IBucketItem extends IBaseModel, ILikeable, IOwned, ITimeStamped, ICommentable, IHasImages, IHasLocation {
    name?: string,
    description?: string,
    href?: string,
}
