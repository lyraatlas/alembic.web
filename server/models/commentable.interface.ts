import { ITimeStamped } from ".";
import { IUser } from "./user.interface";

export interface ICommentable {
    comments?: IComment[];
}

export interface IComment extends ITimeStamped{
	commentBy?: string,
	commentByUser?: IUser,
    comment?: string,
    _id?: string,
}
