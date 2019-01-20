import { IComment, IUser } from "../models/index";
import { UserRepository } from "./user.repo";

export class CommentRepository {
    
    public constructor() {
	}
	
	public async getCommentDetails(comment:IComment){
		// We need to bring back a few details about a comment.
		// We need to grab the user on this comment.

		const userRepo = new UserRepository();
		const user = await userRepo.single(comment.commentBy.toString());
		// we need to clean up the user a bit. we don't want to send back a ton of details on this.
		let cleanUser:IUser = {
			firstName :	 user.firstName,
			lastName :  user && user.lastName && user.lastName.length > 1 ? user.lastName.substring(0,1) : '',
			userId: user.id,
		}

		// Eventually we'll want to put the avatar in here. 
		comment.commentByUser = cleanUser;
		return comment;
	}
}