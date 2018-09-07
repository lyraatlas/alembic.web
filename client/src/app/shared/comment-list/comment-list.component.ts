import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { AlertType, CommentEventType } from '../../../enumerations';
import { CommentEventBus, ICommentEventMessage } from '../../../event-buses/comment.event-bus';
import { ICommentable } from '../../../models';
import { AlertService, LikeableServiceMixin } from '../../../services';
import { CommentableServiceMixin } from '../../../services/mixins/commentable.service.mixin';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

@Component({
	selector: 'app-comment-list',
	templateUrl: './comment-list.component.html',
	styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit {

	public faPen = faPen;

	constructor(
		public commentEventBus: CommentEventBus,
		public alertService: AlertService
	) { }

	@Input() public commentableItem: ICommentable;
	@Input() public likerService: LikeableServiceMixin;
	@Input() public commentService: CommentableServiceMixin;

	private deleteMessage: ICommentEventMessage = null;

	@ViewChild('confirmForComment') confirmForComment: ConfirmModalComponent;

	ngOnInit() {
		this.commentEventBus.commentChanged$.subscribe(message => {

			switch (+message.eventType) {
				case CommentEventType.cancelAdd:
					this.addCancelled();
					break;
				case CommentEventType.updated:
					this.flashCommentableItem(message);
					break;
				case CommentEventType.created:
					this.flashCommentableItem(message);
					break;
				case CommentEventType.removed:
					this.confirmDeleteComment(message);
					break;
				default:
					break;
			}
		})
	}

	flashCommentableItem(message: ICommentEventMessage) {
		this.commentableItem = message.item;
	}

	confirmDeleteComment(message: ICommentEventMessage) {
		this.deleteMessage = message;
		this.confirmForComment.show(message.comment);
	}

	deleteComment() {
		console.log(`About to delete comment:${this.deleteMessage.comment._id}:${this.deleteMessage.comment.comment}`);
		this.commentService.removeComment(this.commentableItem, this.deleteMessage.comment._id).subscribe(responseItem => {
			this.commentableItem = responseItem;
			this.alertService.send({
				text: "Comment has been deleted.",
				alertType: AlertType.success
			}, true);
		});
	}

	addComment() {
		this.commentEventBus.startAddComment(this.commentableItem);
	}

	addCancelled() {
		// we're going to clean up here as well.
		let index = this.commentableItem.comments.findIndex((comment) => {
			return comment._id == 'new';
		})
		this.commentableItem.comments.splice(index, 1);
	}
}
