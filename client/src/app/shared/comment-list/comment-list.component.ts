import { Component, Input, OnInit } from '@angular/core';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { ICommentable } from '../../../models';
import { LikeableServiceMixin } from '../../../services';
import { CommentableServiceMixin } from '../../../services/mixins/commentable.service.mixin';

@Component({
	selector: 'app-comment-list',
	templateUrl: './comment-list.component.html',
	styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit {

	public faPen = faPen;

	constructor() { }

	@Input() public commentableItem: ICommentable;
	@Input() public likerService: LikeableServiceMixin;
	@Input() public commentService: CommentableServiceMixin;

	ngOnInit() {
	}

	addComment(){
		let canAddComment = true;
		this.commentableItem.comments.forEach(comment =>{
			if(comment._id == 'new'){
				canAddComment = false;		
			}
		});
		if(canAddComment){
			this.commentableItem.comments.push({_id:'new'});
		}
	}
}
