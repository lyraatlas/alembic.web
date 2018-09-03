import { Component, Input, OnInit } from '@angular/core';
import { faComment, faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { AlertType } from '../../../enumerations';
import { IComment, ICommentable } from '../../../models';
import { AlertService, LikeableServiceMixin, UserService } from '../../../services';
import { CommentableServiceMixin } from '../../../services/mixins/commentable.service.mixin';
import moment = require('moment');

@Component({
	selector: 'app-comment-item',
	templateUrl: './comment-item.component.html',
	styleUrls: ['./comment-item.component.scss']
})
export class CommentItemComponent implements OnInit {

	@Input() public commentableItem: ICommentable;
	@Input() public likerService: LikeableServiceMixin;
	@Input() public commentService: CommentableServiceMixin;
	@Input() public currentComment: IComment = {};
	@Input() public index: number = 0;


	public faTrashAlt = faTrashAlt;
	public faComment = faComment;
	public faPen = faPen;

	public isEditing: boolean = false;
	public isAdding: boolean = false;

	public tempCommentText: string;

	constructor(
		public userService: UserService,
		public alertService: AlertService,
	) { }

	ngOnInit() {
		if (UserService.getCurrentUserId() == this.currentComment.commentBy) {
			this.currentComment.isDeleteEnabled = true;
			this.currentComment.isEditEnabled = true;
		}
		if (this.currentComment._id == 'new') {
			this.isAdding = true;
		}
	}

	formatTime(time) {
		return moment(time).calendar();//format("MMMM Do YYYY, h:mm a");
	}

	editComment() {
		this.isEditing = true;
		this.tempCommentText = this.currentComment.comment;
	}

	cancelComment() {
		this.isEditing = false;
		// we're going to clean up here as well.
		if (this.isAdding) {
			let index = this.commentableItem.comments.findIndex((comment) => {
				return comment._id == 'new';
			})
			this.commentableItem.comments.splice(index, 1);
			this.isAdding = false;
		}
	}

	saveComment() {
		if (this.isEditing) {
			this.commentService.editComment(this.commentableItem, this.currentComment._id, this.tempCommentText).subscribe(responseItem => {
				this.currentComment.comment = this.tempCommentText;
				this.notifyOnSave();
				this.isEditing = false;
			});
		}
		if (this.isAdding) {
			this.commentService.addComment(this.commentableItem, this.tempCommentText).subscribe(responseItem => {
				this.commentableItem = responseItem;
				// I wouldn't say this is the best way to do this.  sadly I don't want to write what it would take to have a 
				// safe version of this.  This will breaak if there's multiple people who add a comment at the same time.
				this.currentComment = responseItem.comments[responseItem.comments.length - 1];
				this.notifyOnSave();
				this.isAdding = false;
			});
		}
	}

	notifyOnSave() {
		this.alertService.send({
			text: "Comment has been saved.",
			alertType: AlertType.success
		}, true);
	}

	deleteComment() {
		console.log(`About to delete comment:${this.currentComment._id}`);
		this.commentService.removeComment(this.commentableItem, this.currentComment._id).subscribe(responseItem => {
			this.isEditing = false;
			this.commentableItem = responseItem;
			this.alertService.send({
				text: "Comment has been deleted.",
				alertType: AlertType.success
			}, true);
		});
	}
}
