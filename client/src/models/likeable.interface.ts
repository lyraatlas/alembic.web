import { IBaseModel } from ".";


export interface ILikeable extends IBaseModel {
    likedBy?: string[],
    isLikedByCurrentUser?: boolean,
}
