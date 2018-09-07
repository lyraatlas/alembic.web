import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { CommentEventType } from '../enumerations';
import { IComment, ICommentable } from '../models';
import { AlertService } from '../services';

export interface ICommentEventMessage{
    comment: IComment,
    eventType: CommentEventType,
    item: ICommentable,
}

@Injectable()
export class CommentEventBus {
    private commentChangedSource = new Subject<ICommentEventMessage>();
    
    public commentChanged$ = this.commentChangedSource.asObservable();

	constructor(private alertService: AlertService){};
	
	public startAddComment(item:ICommentable){
		let canAddComment = true;
		item.comments.forEach(comment => {
			if (comment._id == 'new') {
				canAddComment = false;
			}
		});
		if (canAddComment) {
			item.comments.push({ _id: 'new' });
		}
	}

	public addComment(comment:IComment, item:ICommentable){
		this.emitMessage(comment,CommentEventType.created,item);
	}

	public editComment(comment:IComment, item:ICommentable){
		this.emitMessage(comment,CommentEventType.updated,item);
	}

	public removeComment(comment:IComment, item:ICommentable){
		this.emitMessage(comment,CommentEventType.removed,item);
	}

	
	public cancelCommentAdd(comment:IComment, item:ICommentable){
		this.emitMessage(comment,CommentEventType.cancelAdd,item);
	}
    
    private emitMessage(comment: IComment, eventType: CommentEventType, item: ICommentable){
        this.commentChangedSource.next({
            eventType: eventType,
            comment: comment,
            item: item
        })
    }
}