import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faComment, faEdit, faHeart, faPen, faPlusCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { CONST } from '../../../../constants';
import { AlertType, BucketEventType, BucketItemEventType } from '../../../../enumerations';
import { ErrorEventBus } from '../../../../event-buses';
import { BucketItemEventBus } from '../../../../event-buses/bucket-item.event-bus';
import { BucketEventBus } from '../../../../event-buses/bucket.event-bus';
import { CommentEventBus } from '../../../../event-buses/comment.event-bus';
import { IBucket, IBucketItem, ITokenPayload } from '../../../../models';
import { IImage } from '../../../../models/image.interface';
import { AlertService } from '../../../../services';
import { BucketItemService } from '../../../../services/bucket-item.service';
import { BucketService } from '../../../../services/bucket.service';
import { ConfirmModalComponent } from '../../../shared/confirm-modal/confirm-modal.component';

@Component({
	selector: 'app-bucket-detail',
	templateUrl: './bucket-detail.component.html',
	styleUrls: ['./bucket-detail.component.scss']
})
export class BucketDetailComponent implements OnInit {
	// Icons

	public faHeart = faHeart;
	public faEdit = faEdit;
	public faPlusCircle = faPlusCircle;
	public faTrashAlt = faTrashAlt;
	public faComment = faComment;
	public faPen = faPen;
	public currentBucketId: string;

	public bucket: IBucket = this.bucketItemEventBus.bucket;

	public bucketItemImages: Array<IImage> = [];

	public userId: string = (JSON.parse(localStorage.getItem(CONST.CLIENT_DECODED_TOKEN_LOCATION)) as ITokenPayload).userId;

	@ViewChild('confirmForItem') public itemConfirmModal: ConfirmModalComponent;

	constructor(private route: ActivatedRoute,
		private router: Router,
		public bucketService: BucketService,
		public bucketItemService: BucketItemService,
		private errorEventBus: ErrorEventBus,
		public ngxSmartModalService: NgxSmartModalService,
		public alertService: AlertService,
		public commentEventBus: CommentEventBus,
		public bucketEventBus: BucketEventBus,
		public bucketItemEventBus: BucketItemEventBus
	) { }

	ngOnInit() {
		this.route.params.subscribe( async params => {
			// if there isn't an id then it's a new product.
			if (params['id']) {
				this.currentBucketId = params['id'];
				await this.bucketItemEventBus.loadBucket(this.currentBucketId);
				this.bucket = this.bucketItemEventBus.bucket;
				this.buildImageGrid();
			}
		});

		this.bucketEventBus.BucketChanged$.subscribe(message => {
			switch (+message.eventType) {
				case +BucketEventType.edited:
					//save off the items first, because on an update, we only have id's back from the server
					this.bucket = message.bucket;
					this.ngxSmartModalService.close("quickEditBucketModal");
					break;
				case +BucketEventType.cancelEdit:
					this.bucket = message.bucket;
					this.ngxSmartModalService.close("quickEditBucketModal");
					break;
				case +BucketEventType.startEdit:
					this.ngxSmartModalService.open("quickEditBucketModal");
					break;
				default:
					break;
			}
		});

		this.bucketItemEventBus.BucketItemChanged$.subscribe(message => {
			switch (+message.eventType) {
				case +BucketItemEventType.created:
					if(!this.bucket.bucketItems){
						this.bucket.bucketItems = new Array<IBucketItem>();
					}
					this.bucket.bucketItems = message.bucket.bucketItems;
					this.ngxSmartModalService.close("quickEditBucketItem");
					//this.router.navigate(['/bucket-item/detail', message.bucket._id]);
					break;
				case +BucketItemEventType.edited:
					this.updateBucketItem(message.bucketItem);
					this.ngxSmartModalService.close("quickEditBucketItem");
					break;
				case +BucketItemEventType.cancelCreate:
				case +BucketItemEventType.cancelEdit:
					this.bucket = message.bucket;
					this.ngxSmartModalService.close("quickEditBucketItem");
					break;
				case +BucketItemEventType.startEdit:
				case +BucketItemEventType.startCreate:
						this.ngxSmartModalService.open("quickEditBucketItem");
						break;
				case +BucketItemEventType.startDelete:
						this.itemConfirmModal.show(message.bucketItem);
						break;
				case +BucketItemEventType.startDelete:
						this.bucket = message.bucket;
						break;
				default:
					break;
			}
		});
	}

	public buildImageGrid(){
		this.bucketItemImages = new Array<IImage>();
		
		for (let index = 0; index < this.bucket.bucketItems.length; index++) {
			const bItem = this.bucket.bucketItems[index] as IBucketItem;

			if (bItem && bItem.images && bItem.images.length > 0) {
				for (let z = 0; z < bItem.images.length; z++) {
					const img = bItem.images[z];
					img.routerLink = `/bucket-item/detail/${bItem._id}`;
				}
				this.bucketItemImages = this.bucketItemImages.concat(bItem.images);
			}
		}
	}

	//#region Bucket Methods

	deleteBucket(bucket: IBucket) {
		this.bucketService.delete(this.currentBucketId).subscribe((item) => {
			this.bucketEventBus.removeBucket(this.bucket);
			// item is some kind of delete response;
			this.alertService.send({
				text: "Successfully Deleted Bucket Board",
				alertType: AlertType.success
			}, true);
			this.backToBuckets();
		})
	}

	editBucket(){
		this.ngxSmartModalService.open("quickEditBucketModal");
		this.bucketEventBus.startEditBucket(this.bucket);
	}

	toggleLike() {
		this.bucketService.liker.toggleLike(this.bucket, this.errorEventBus).subscribe(item => {
			// on update we're going to save off the items, and load them back on the object.
			let items = this.bucket.bucketItems;
			this.bucket = item;
			this.bucket.bucketItems = items;
		});
	}

	//#endregion

	backToBuckets() {
		this.router.navigate(['/bucket-board']);
	}

	async deleteItem(bucketItem: IBucketItem) {
		this.bucketItemEventBus.removeBucketItem(bucketItem);
	}

	addBucketItem() {
		this.bucketItemEventBus.startCreateBucketItem();
		this.ngxSmartModalService.open("quickEditBucketItem");
	}

	updateBucketItem(bucketItem: IBucketItem) {
		for (let j = 0; j < this.bucket.bucketItems.length; j++) {
			const item = this.bucket.bucketItems[j] as IBucketItem;
			if (item && item._id && item._id == bucketItem._id) {
				this.bucket.bucketItems[j] = bucketItem;
			}
		}
	}

	addComment(bucket: IBucket) {
		this.commentEventBus.startAddComment(this.bucket);
	}
}
