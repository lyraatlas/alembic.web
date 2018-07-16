import { ITimeStamped } from ".";
import { IBaseModel } from "./base/base-model.interface";

export interface ICommentable extends IBaseModel{
    comments?: IComment[];
}

export interface IComment extends ITimeStamped{
    commentBy?: string,
    comment?: string,
    _id?: string,
}
