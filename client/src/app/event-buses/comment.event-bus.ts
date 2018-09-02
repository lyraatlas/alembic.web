import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { CommentEventType } from '../../enumerations';
import { IComment, ICommentable } from '../../models';
import { AlertService } from '../../services/index';

export interface ICommentEventMessage{
    comment: IComment,
    eventType: CommentEventType,
    item: ICommentable,
}

@Injectable()
export class CommentEventBus {
    private commentChangedSource = new Subject<ICommentEventMessage>();
    
    public commentChanged$ = this.commentChangedSource.asObservable();

    // Mostly managed by the product images component.
    public comments: Array<IComment>;

	constructor(private alertService: AlertService){};
	
	public addComment(comment:IComment, item:ICommentable){
		this.emitMessage(comment,CommentEventType.created,item);
	}

	public editComment(comment:IComment, item:ICommentable){
		this.emitMessage(comment,CommentEventType.updated,item);
	}

	public removeComment(comment:IComment, item:ICommentable){
		this.emitMessage(comment,CommentEventType.removed,item);
	}
    
    private emitMessage(comment: IComment, eventType: CommentEventType, item: ICommentable){
        this.commentChangedSource.next({
            eventType: eventType,
            comment: comment,
            item: item
        })
    }
}