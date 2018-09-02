import { Component, Input, OnInit } from '@angular/core';
import { IComment } from '../../../models';
import moment = require('moment');

@Component({
	selector: 'app-comment-item',
	templateUrl: './comment-item.component.html',
	styleUrls: ['./comment-item.component.scss']
})
export class CommentItemComponent implements OnInit {

	@Input() public currentComment: IComment = {};
	@Input() public index: number = 0;


	constructor() { }

	ngOnInit() {
	}

	formatTime(time){
		console.log(time);
		return moment(time).calendar();//format("MMMM Do YYYY, h:mm a");
	}
}
