import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faComment, faEdit, faHeart, faPen, faPlusCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { CONST } from '../../../../constants';
import { AlertType, EditControlMode } from '../../../../enumerations';
import { ErrorEventBus } from '../../../../event-buses';
import { IBucket, IBucketItem, ITokenPayload } from '../../../../models';
import { AlertService, LikeableServiceMixin } from '../../../../services';
import { BucketItemService } from '../../../../services/bucket-item.service';
import { BucketService } from '../../../../services/bucket.service';

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
	public bucketItem: IBucketItem = {};
	public bucket: IBucket;
	public itemsPerRow = 4;
	public bucketItemTable: Array<Array<IBucket>> = new Array();
	public editControlMode = EditControlMode.edit;
	public originalName: string;
	public originalDesc: string;

	public userId: string = (JSON.parse(localStorage.getItem(CONST.CLIENT_DECODED_TOKEN_LOCATION)) as ITokenPayload).userId;

	constructor(private route: ActivatedRoute,
		private router: Router,
		public bucketService: BucketService,
		public bucketItemService: BucketItemService,
		private errorEventBus: ErrorEventBus,
		public ngxSmartModalService: NgxSmartModalService,
		public alertService: AlertService,
	) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			// if there isn't an id then it's a new product.
			if (params['id']) {
				this.currentBucketId = params['id'];
				this.fetchBucket();
			}
		});
	}

	//#region Bucket Methods

	deleteBucket(bucket: IBucket) {
		this.bucketService.delete(this.currentBucketId).subscribe((item) => {
			// item is some kind of delete response;
			this.alertService.send({
				text: "Successfully Deleted Bucket Board",
				alertType: AlertType.success
			}, true);
			this.backToBuckets();
		})
	}

	toggleLike() {
		this.bucketService.liker.toggleLike(this.bucket, this.errorEventBus).subscribe(item => {
			this.bucket = item;
		});
	}

	canceled() {
		this.bucket.description = this.originalDesc;
		this.bucket.name = this.originalName;
		this.ngxSmartModalService.close("quickEditBucketModal");
	}

	//#endregion

	backToBuckets() {
		this.router.navigate(['/bucket-board']);
	}

	cancelQuickEdit() {
		this.ngxSmartModalService.close("quickEditBucketItem");
	}

	deleteItem(bucketItem: IBucketItem) {
		this.bucketItemService.removeFromBucket(bucketItem._id, this.bucket._id).subscribe(res => {
			this.bucketItem = {};
			this.fetchBucket();
		}, error => {
			this.errorEventBus.throw(error);
		});
	}

	bucketSaved(bucket: IBucket) {
		this.ngxSmartModalService.close("quickEditBucketModal");
		this.fetchBucket();
	}

	editBucket(bucket: IBucket) {
		this.originalName = bucket.name;
		this.originalDesc = bucket.description;
		this.editControlMode = EditControlMode.edit;
		this.ngxSmartModalService.open("quickEditBucketModal");
	}


	quickEditItem(bucketItem: IBucketItem) {
		this.bucketItem = bucketItem;
		this.ngxSmartModalService.open("quickEditBucketItem");
	}

	bucketItemSaved(event) {
		this.ngxSmartModalService.close("quickEditBucketItem");
		// We also need to clean up any of our temp variables.
		this.bucketItem = {};
		this.fetchBucket();
	}

	addRemoveLike(item: IBucketItem) {
		this.bucketItemService.liker.toggleLike(item, this.errorEventBus).subscribe(item => {
			this.bucketItem = item;
			this.updateBucketItemInTable(this.bucketItem);
		});
	}

	addBucketItem() {
		this.ngxSmartModalService.open("quickEditBucketItem");
	}

	updateBucketItemInTable(bucketItem: IBucketItem) {
		for (let j = 0; j < this.bucketItemTable.length; j++) {
			const row = this.bucketItemTable[j];
			for (let i = 0; i < row.length; i++) {
				const item = row[i];
				if (item && item._id && item._id == bucketItem._id) {
					row[i] = bucketItem;
				}
			}
		}
	}

	fetchBucket(): any {

		this.bucketService.get(this.currentBucketId).subscribe((item: IBucket) => {

			this.bucket = item;

			LikeableServiceMixin.calculateLikeStatus(new Array(this.bucket));

			if (this.bucket && this.bucket.bucketItems && this.bucket.bucketItems.length > 0) {

				const numberOfRows = Math.ceil(this.bucket.bucketItems.length / this.itemsPerRow);

				for (let i = 0; i < numberOfRows; i++) {
					this.bucketItemTable[i] = new Array<IBucket>();
				}

				// Now we're going to build up a list of rows.  we're going to put 4 items in each row.
				let currentBucketIndex = 0;

				for (let i = 0; i < numberOfRows; i++) {
					for (let slotNumber = 0; slotNumber < this.itemsPerRow; slotNumber++) {
						LikeableServiceMixin.calculateLikeStatus(this.bucket.bucketItems as IBucketItem[]);
						this.bucketItemTable[i][slotNumber] = this.bucket.bucketItems[currentBucketIndex] as IBucketItem;
						++currentBucketIndex;
					}
				}
			} else {
				this.bucketItemTable = new Array();
			}
		}, error => {
			this.errorEventBus.throw(error);
		});
	}
}
