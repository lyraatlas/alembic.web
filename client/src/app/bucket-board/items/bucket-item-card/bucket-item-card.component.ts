import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faComment, faEdit, faHeart, faPen, faPlusCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { CONST } from '../../../../constants';
import { CommentEventBus, ErrorEventBus } from '../../../../event-buses';
import { BucketItemEventBus } from '../../../../event-buses/bucket-item.event-bus';
import { IBucket, IBucketItem, ITokenPayload } from '../../../../models';
import { AlertService } from '../../../../services';
import { BucketItemService } from '../../../../services/bucket-item.service';

@Component({
	selector: 'app-bucket-item-card',
	templateUrl: './bucket-item-card.component.html',
	styleUrls: ['./bucket-item-card.component.scss']
})
export class BucketItemCardComponent implements OnInit {

	public faHeart = faHeart;
	public faEdit = faEdit;
	public faPlusCircle = faPlusCircle;
	public faTrashAlt = faTrashAlt;
	public faComment = faComment;
	public faPen = faPen;

	@Input() public bucketItem: IBucketItem;
	@Input() public bucket: IBucket;

	public userId: string = (JSON.parse(localStorage.getItem(CONST.CLIENT_DECODED_TOKEN_LOCATION)) as ITokenPayload).userId;

	constructor(private route: ActivatedRoute,
		private router: Router,
		public bucketItemService: BucketItemService,
		private errorEventBus: ErrorEventBus,
		public alertService: AlertService,
		public commentEventBus: CommentEventBus,
		public bucketItemEventBus: BucketItemEventBus) { }

	ngOnInit() {
	}

	deleteItem(bucketItem: IBucketItem) {
		this.bucketItemEventBus.startRemoveBucketItem(this.bucketItem);
	}

	quickEditItem() {
		this.bucketItemEventBus.startEditBucketItem(this.bucketItem);
	}

	addRemoveLike() {
		this.bucketItemService.liker.toggleLike(this.bucketItem, this.errorEventBus).subscribe(item => {
			this.bucketItem = item;
		});
	}

	addComment() {
		// Navigate to the bucketItem, and start adding a comment.
	}
}
