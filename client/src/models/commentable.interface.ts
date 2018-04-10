import { ITimeStamped } from ".";

export interface ICommentable {
    comments?: IComment[];
}

export interface IComment extends ITimeStamped{
    commentBy?: string,
    comment?: string,
    _id?: string,
}
