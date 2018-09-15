import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { AlertType, BucketEventType, EditControlMode } from '../../../../enumerations';
import { ErrorEventBus } from '../../../../event-buses';
import { BucketEventBus } from '../../../../event-buses/bucket.event-bus';
import { IBucket } from '../../../../models';
import { AlertService, UserService } from '../../../../services';
import { BucketService } from '../../../../services/bucket.service';

@Component({
	selector: 'app-bucket-edit-control',
	templateUrl: './bucket-edit-control.component.html',
	styleUrls: ['./bucket-edit-control.component.scss']
})
export class BucketEditControlComponent implements OnInit {

	public mode: EditControlMode = EditControlMode.edit;

	// Used in the template
	public editControlMode = EditControlMode;

	public bucket: IBucket;
	constructor(public bucketService: BucketService,
		private errorEventBus: ErrorEventBus,
		public ngxSmartModalService: NgxSmartModalService,
		public alertService: AlertService,
		public userService: UserService,
		public bucketEventBus: BucketEventBus
	) { }

	ngOnInit() {
		this.bucketEventBus.BucketChanged$.subscribe(message => {

			switch (+message.eventType) {
				case +BucketEventType.startCreate:
					this.mode = EditControlMode.create;
					this.bucket = message.bucket;
					break;
				case +BucketEventType.startEdit:
					this.mode = EditControlMode.edit;
					this.bucket = message.bucket;
					break;
				default:
					break;
			}
		});
	}

	cancelHandler() {
		+this.mode == +EditControlMode.create ?
			this.bucketEventBus.cancelBucketCreate(this.bucket) :
			this.bucketEventBus.cancelEditBucket(this.bucket);
	}

	saveBucket(isValid: boolean) {
		if (isValid) {
			switch (+this.mode) {
				case +EditControlMode.create:
					this.bucketService.create(this.bucket).subscribe((response: IBucket) => {
						this.bucket = response;

						this.alertService.send({ text: `Created new Bucket Board: ${this.bucket.name}.`, alertType: AlertType.success }, true);

						this.bucketEventBus.createBucket(this.bucket);

					}, error => {
						this.errorEventBus.throw(error);
					});
					break;
				case +EditControlMode.edit:
					this.bucketService.update(this.bucket, this.bucket._id).subscribe(response => {

						// On save we only get back id's from the server after updating.  So we're going to save off a version of the items,
						// and then overwrite the bucket details.
						let tempItems = this.bucket.bucketItems;
						this.bucket = response;
						this.bucket.bucketItems = tempItems;

						this.alertService.send({ text: 'Successfully Saved.', alertType: AlertType.success }, false);

						this.bucketEventBus.saveEditBucket(this.bucket);

					}, error => {
						this.errorEventBus.throw(error);
					});
					break;
				default:
					break;
			}
		}
	}

}
