import { ITimeStamped } from ".";

export interface ICommentable {
    comments?: IComment[];
    totalComments?: number;
}

export interface IComment extends ITimeStamped{
    commentBy?: string,
    comment?: string,
    _id?: string,
}
