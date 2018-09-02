import { ITimeStamped } from ".";
import { IBaseModel } from "./base/base-model.interface";
import { IUser } from "./user.interface";

export interface ICommentable extends IBaseModel{
    comments?: IComment[];
}

export interface IComment extends ITimeStamped{
	commentBy?: string,
	commentByUser?: IUser,
	comment?: string,
    _id?: string,
}
