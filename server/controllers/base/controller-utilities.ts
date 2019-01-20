import { ICommentable } from "../../models";
import { CommentRepository } from "../../repositories/comment.repo";

export class ControllerUtilities{

	public async populateComments(item: ICommentable): Promise<ICommentable>{
		if(item && item.comments && item.comments.length > 0){
			for (let index = 0; index < item.comments.length; index++) {
				let comment = item.comments[index];
				item.comments[index] = await new CommentRepository().getCommentDetails(comment);
			}
		}
		return item;
	}	
}