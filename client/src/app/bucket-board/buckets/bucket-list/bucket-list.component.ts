import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faComment, faHeart, faPen, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { BucketEventType } from '../../../../enumerations';
import { ErrorEventBus } from '../../../../event-buses';
import { BucketEventBus } from '../../../../event-buses/bucket.event-bus';
import { IBucket } from '../../../../models';
import { AlertService, BucketService, LikeableServiceMixin, UserService } from '../../../../services';


@Component({
	selector: 'app-bucket-list',
	templateUrl: './bucket-list.component.html',
	styleUrls: ['./bucket-list.component.scss'],
})
export class BucketListComponent implements OnInit {

	public faComment = faComment;
	public faHeart = faHeart;
	public faPencilAlt = faPencilAlt;
	public faPen = faPen;

	public buckets: Array<IBucket>;

	constructor(
		private bucketService: BucketService,
		private errorEventBus: ErrorEventBus,
		public ngxSmartModalService: NgxSmartModalService,
		public alertService: AlertService,
		public userService: UserService,
		private route: ActivatedRoute,
		private router: Router,
		public bucketEventBus: BucketEventBus
	) {
	}

	ngOnInit() {
		this.loadBuckets();
		this.bucketEventBus.BucketChanged$.subscribe(message => {
			switch (+message.eventType) {
				case +BucketEventType.created:
					this.buckets.push(message.bucket);
					//this.updateBucketDetails(message.bucket);
					this.ngxSmartModalService.close("quickEditBucketModal");
					this.router.navigate(['/bucket-board/detail', message.bucket._id]);
					break;
				case +BucketEventType.edited:
					this.updateBucketDetails(message.bucket);
					this.ngxSmartModalService.close("quickEditBucketModal");
					break;
				case +BucketEventType.cancelCreate:
				case +BucketEventType.cancelEdit:
					this.ngxSmartModalService.close("quickEditBucketModal");
					break;
				case +BucketEventType.startEdit:
				case +BucketEventType.startCreate:
						this.ngxSmartModalService.open("quickEditBucketModal");
						break;
				default:
					break;
			}
		});
	}

	public createBucket(){
		this.bucketEventBus.startCreateBucket({});
		this.ngxSmartModalService.open("quickEditBucketModal");		
	}

	loadBuckets() {
		this.bucketService.getMyList().subscribe((items: Array<IBucket>) => {

			this.buckets = items;

			LikeableServiceMixin.calculateLikeStatus(this.buckets);

		}, error => {
			this.errorEventBus.throw(error);
		});
	}

	updateBucketDetails(bucket: IBucket) {
		for (let j = 0; j < this.buckets.length; j++) {
			const item = this.buckets[j];
			if (item && item._id && item._id == bucket._id) {
				this.buckets[j] = bucket;
			}
		}
	}
}
