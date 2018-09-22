import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { CommentEventBus, ErrorEventBus } from '.';
import { AlertType, BucketItemEventType } from '../enumerations';
import { IBucket, IBucketItem } from '../models';
import { AlertService, BucketService, LikeableServiceMixin } from '../services';
import { BucketItemService } from '../services/bucket-item.service';

export interface IBucketItemEventMessage {
	bucketItem: IBucketItem,
	bucket?: IBucket,
	eventType: BucketItemEventType,
}

@Injectable()
export class BucketItemEventBus {
	private BucketItemChangedSource = new Subject<IBucketItemEventMessage>();
	public BucketItemChanged$ = this.BucketItemChangedSource.asObservable();

	public bucket: IBucket;
	public createdBucketItem: IBucketItem;

	public originalName: string;
	public originalDesc: string;

	constructor(private route: ActivatedRoute,
		private router: Router,
		public bucketService: BucketService,
		public bucketItemService: BucketItemService,
		private errorEventBus: ErrorEventBus,
		public alertService: AlertService,
		public commentEventBus: CommentEventBus
	) { };


	public async loadBucket(id: string): Promise<IBucket> {

		try {
			this.bucket = await this.bucketService.get(id).toPromise<IBucket>();
		} catch (err) {
			this.errorEventBus.throw(err);
		}

		LikeableServiceMixin.calculateLikeStatus(new Array(this.bucket));

		if (this.bucket && this.bucket.bucketItems) {
			LikeableServiceMixin.calculateLikeStatus(this.bucket.bucketItems as IBucketItem[]);
		}

		return this.bucket;
	}

	public startCreateBucketItem() {
		if (!this.bucket.bucketItems) {
			this.bucket.bucketItems = new Array<IBucketItem>();
		}
		this.emitMessage(null, this.bucket, BucketItemEventType.startCreate);
	}

	public createBucketItem(bucketItem: IBucketItem) {

		// First we go in and create the bucket item.  Then we're going to update the bucket with the new bucket item.
		let serverCall: Observable<IBucketItem>;
		// we have a bit of a tricky situation.  Sometimes we're doing an update, and sometimes it's a create
		// in the case of when we have already added images it's mor of an update.  luckily the return types are the same so everything 
		// following is the same.
		if (!bucketItem._id) {
			serverCall = this.bucketItemService.create(bucketItem);
		}
		else {
			serverCall = this.bucketItemService.update(bucketItem, bucketItem._id);
		}
		serverCall
			.map(createdItem => {
				this.createdBucketItem = createdItem;
				return createdItem;
			})
			.flatMap(() => {

				return this.bucketService.update(this.bucket, this.bucket._id);

			})
			.flatMap(()=>{
				return this.bucketService.get(this.bucket._id);
			})
			.subscribe((fullBucket) => {
				this.bucket = fullBucket;
				this.emitMessage(this.createdBucketItem, this.bucket, BucketItemEventType.created);
			}, error => {
				this.errorEventBus.throw(error);
			});
	}

	public cancelBucketItemCreate(bucketItem: IBucketItem) {
		this.emitMessage(bucketItem, null, BucketItemEventType.cancelCreate);
	}

	public startEditBucketItem(bucketItem: IBucketItem) {
		this.originalName = bucketItem.name;
		this.originalDesc = bucketItem.description;
		this.emitMessage(bucketItem, this.bucket, BucketItemEventType.startEdit);
	}

	public saveEditBucketItem(bucketItem: IBucketItem) {
		this.originalName = null;
		this.originalDesc = null;

		this.bucketItemService.update(bucketItem, bucketItem._id).subscribe(item => {
			this.emitMessage(bucketItem, this.bucket, BucketItemEventType.edited);

			this.alertService.send({
				text: `Successfully Updated Item: ${bucketItem.name}`,
				alertType: AlertType.success
			}, true);
		}, error => {
			this.errorEventBus.throw(error);
		});
	}

	public async cancelEditBucketItem(bucketItem: IBucketItem) {
		// Hammer smash load the whole bucket again. 
		//await this.loadBucket(this.bucket._id);
		bucketItem.name = this.originalName;
		bucketItem.description = this.originalDesc;
		this.emitMessage(bucketItem, this.bucket, BucketItemEventType.cancelEdit);
	}

	public startRemoveBucketItem(bucketItem: IBucketItem) {
		this.emitMessage(bucketItem, this.bucket, BucketItemEventType.startDelete);
	}

	public removeBucketItem(bucketItem: IBucketItem) {
		this.bucketItemService.removeFromBucket(bucketItem._id, this.bucket._id).subscribe(async res => {

			// we're going to clean up here as well.
			let index = (this.bucket.bucketItems as Array<IBucketItem>).findIndex((item) => {
				return item._id == bucketItem._id;
			});
			this.bucket.bucketItems.splice(index, 1);

			this.emitMessage(bucketItem, this.bucket, BucketItemEventType.removed);

			this.alertService.send({
				text: `Successfully Deleted Item: ${bucketItem.name}`,
				alertType: AlertType.success
			}, true);
		}, error => {
			this.errorEventBus.throw(error);
		});

	}

	private emitMessage(bucketItem: IBucketItem, bucket: IBucket, eventType: BucketItemEventType) {
		this.BucketItemChangedSource.next({
			eventType: eventType,
			bucket: bucket,
			bucketItem: bucketItem,
		})
	}
}