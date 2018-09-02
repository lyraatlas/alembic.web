import { Component, Input, OnInit } from '@angular/core';
import { ICommentable } from '../../../models';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit {

  constructor() { }

  @Input() public commentable: ICommentable = {};

  ngOnInit() {
  }

}
