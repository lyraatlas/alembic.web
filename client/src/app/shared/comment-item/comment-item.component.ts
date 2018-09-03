import { Component, Input, OnInit } from '@angular/core';
import { faComment, faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { IComment } from '../../../models';
import { UserService } from '../../../services';
import moment = require('moment');

@Component({
	selector: 'app-comment-item',
	templateUrl: './comment-item.component.html',
	styleUrls: ['./comment-item.component.scss']
})
export class CommentItemComponent implements OnInit {

	@Input() public currentComment: IComment = {};
	@Input() public index: number = 0;

	public faTrashAlt = faTrashAlt;
	public faComment = faComment;
	public faPen = faPen;

	constructor(userService: UserService) { }

	ngOnInit() {
		if (UserService.getCurrentUserId() == this.currentComment.commentBy) {
			this.currentComment.isDeleteEnabled = true;
			this.currentComment.isEditEnabled = true;
		}
	}

	formatTime(time) {
		return moment(time).calendar();//format("MMMM Do YYYY, h:mm a");
	}
}
