import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faCameraRetro, faPlusSquare, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { UploadFile } from '../../../../classes/upload-file.class';
import { UploadResponse } from '../../../../classes/upload-response.class';
import { AlertType, EditControlMode, UploadStatus } from '../../../../enumerations';
import { ErrorEventBus } from '../../../../event-buses';
import { IBucket } from '../../../../models';
import { IBucketItem } from '../../../../models/bucket-item.interface';
import { AlertService, BucketService, UserService } from '../../../../services';
import { BucketItemService } from '../../../../services/bucket-item.service';

@Component({
	selector: 'app-bucket-item-quick-edit',
	templateUrl: './bucket-item-quick-edit.component.html',
	styleUrls: ['./bucket-item-quick-edit.component.scss']
})
export class BucketItemQuickEditComponent implements OnInit, OnChanges {

	@Output() bucketItemChanged = new EventEmitter();
	@Output() cancel = new EventEmitter();
	@Output() bucketItemSaved = new EventEmitter<IBucketItem>();

	@Input() bucket: IBucket = {};
	@Input() currentBucketItem: IBucketItem = {};

	@ViewChild('laFileInput') fileInput: ElementRef;

	// Public enumerations
	public EditControlMode = EditControlMode;
	public faCameraRetro = faCameraRetro;
	public faPlusSquare = faPlusSquare;
	public faTrashAlt = faTrashAlt;

	//Upload Images Control
	public files: File[] = [];
	public uploadFiles: Array<UploadFile> = [];
	public controlMode: EditControlMode = EditControlMode.create;
	public isUploadComplete: boolean = true;
	public name: string;
	public description: string;


	constructor(private bucketService: BucketService,
		private errorEventBus: ErrorEventBus,
		public alertService: AlertService,
		public userService: UserService,
		private route: ActivatedRoute,
		private bucketItemService: BucketItemService,
		private router: Router) { }

	ngOnInit() {
	}

	ngOnChanges(changes: SimpleChanges) {
		// Whenever a bucket item changes, we're going to want to build up our images table.
		if (this.currentBucketItem && this.currentBucketItem.images) {
			// Whenever our bucket changes, we're going to clear out the table, and rebuild.
			this.uploadFiles.length = 0;
			this.currentBucketItem.images.forEach(image => {
				this.uploadFiles.push({
					id: image._id,
					url: image.variations[0].url,
					file: image.variations[0].url,
					status: UploadStatus.finished,
					statusText: "Added",
				});
			});
		}
		else{
			// If we're adding something new, we need to clear out the array.  
			// This happens when someone presses add, and we need to "reset" the control.
			this.uploadFiles.length = 0;
		}
	}

	public onFilesSelected(e: any) {
		let selectedFiles: Array<File> = this.fileInput.nativeElement.files;
		this.processFiles(selectedFiles);
	}

	public onFilesDropped(files: Array<File>) {
		this.processFiles(files);
	}

	public processFiles(files: Array<File>) {

		if (files.length > 5) {
			this.alertService.send({
				alertType: AlertType.warning,
				text: "Sorry but you can only upload 5 images at a time."
			});
			return;
		}

		// We want to handle the processing first.
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			if (file && this.validateFileType(file.type)) {

				this.uploadFiles.push({
					id: i.toString(),
					file: file,
					status: UploadStatus.pending,
					statusText: "Uploading...",
				});
			}
		}

		if (this.uploadFiles.length > 0) {
			this.isUploadComplete = false;
		}

		// if we haven't created this bucket item yet, then we need to create it first.
		if (this.currentBucketItem == null || !this.currentBucketItem._id || this.currentBucketItem._id == '') {

			this.bucketItemService.create(this.currentBucketItem).map(createdItem => {
				this.currentBucketItem = createdItem;

				this.intializeBucketItemsArray();

				// Now add the bucket item id to the array on the bucket.
				(this.bucket.bucketItems as string[]).push(createdItem._id);

				this.pushImagesToServer();

				return createdItem;
			}).flatMap(createdItem => {

				return this.bucketService.update(this.bucket, this.bucket._id);

			}).subscribe(updatedBucket => {

				this.bucket = updatedBucket;

			}, error => {
				this.errorEventBus.throw(error);
			});
		} else {

			this.pushImagesToServer();

		}
	}

	pushImagesToServer() {
		let imageUploads: Observable<UploadResponse>[] = [];
		let totalImages: number = imageUploads.length;


		for (let i = 0; i < this.uploadFiles.length; i++) {
			if (this.uploadFiles[i].status == UploadStatus.pending) {
				imageUploads.push(this.bucketItemService.uploadImage(this.uploadFiles[i], this.currentBucketItem._id));
			}
		}

		// ... => breaks up the parameter from an array into individual parameters passed to the method.
		// Observable.concat takes and runs these in series.
		Observable.merge(...imageUploads).subscribe(uploadResponse => {

			// here we're going to figure out which image has been uploaded.  we're going to diff the images, and that will show us 
			// the image that has been uplaoded.
			let addedImage = this.getAddedImage(this.currentBucketItem.images, uploadResponse.bucketItem.images);

			// If we just blanket push these changes on top of the bucket item, then we'll blow away any changes the
			// user might have made to name and description.
			this.currentBucketItem.images = uploadResponse.bucketItem.images;

			// We're using these two variables as a flag to tell when we can turn the save button back on. 
			--totalImages;
			this.isUploadComplete = totalImages <= 0;

			const index = this.uploadFiles.findIndex(uploadFileSingle =>{
				return uploadFileSingle.id == uploadResponse.uploadFile.id;
			});
			this.uploadFiles[index].status = UploadStatus.finished;
			this.uploadFiles[index].statusText = "Upload Successful!";

			// Now we're able to put a face to this upload, and actually load the url. 
			this.uploadFiles[index].url = addedImage.variations[0].url;
			console.log('Image Added');
		});
	}

	getAddedImage(currentImages: IImage[], newImages: IImage[]): IImage{
		let addedImages = newImages.filter(newItem =>{
			return !currentImages.some(current =>{
				return newItem._id == current._id;
			})
		});

		return addedImages && addedImages.length > 0 ? addedImages[0] : null;
	}

	saveBucketItem(isValid: boolean) {
		if (isValid) {

			this.intializeBucketItemsArray();

			// If we have an id then we just update the bucket item.
			if (this.currentBucketItem._id) {

				this.bucketItemService.update(this.currentBucketItem, this.currentBucketItem._id).subscribe(item => {

					this.clearControl();

					this.bucketItemSaved.emit(item);
				}, error => {
					this.errorEventBus.throw(error);
				});

			} else {
				// First we go in and create the bucket item.  Then we're going to update the bucket with the new bucket item.
				this.bucketItemService.create(this.currentBucketItem)
					.map(createdItem => {

						(this.bucket.bucketItems as string[]).push(createdItem._id);
						// Save off the created item for later so we can emit it.
						this.currentBucketItem = createdItem;
						return createdItem;
					})
					.flatMap(() => {

						return this.bucketService.update(this.bucket, this.bucket._id);

					})
					.subscribe((updatedBucket) => {

						this.bucket = updatedBucket;
						this.bucketItemSaved.emit(this.currentBucketItem);
						this.clearControl();

					}, error => {
						this.errorEventBus.throw(error);
					});
			}
		}
	}

	public intializeBucketItemsArray() {
		// If the bucket doesn't have a list of items, then we create a new list for it.
		if (!this.bucket.bucketItems) {
			this.bucket.bucketItems = new Array<string>();
		}

	}

	public validateFileType(type: string) {
		return (type == "image/jpeg" || type == "image/jpg" || type == "image/png")
	}

	public validateFileName(name: string) {
		const parts = name.split('.');
		if (parts && parts.length > 1) {
			const extension = parts[parts.length - 1];
			console.log(extension);
			console.log(name);
			return (extension == 'jpg' ||
				extension == 'jpeg' ||
				extension == 'png')
		}
		return false;
	}

	public clearControl() {
		// this will clear the array
		this.uploadFiles.length = 0;
		this.currentBucketItem = {};
	}

	public fileOver(event) {
	}

	public fileLeave(event) {
	}

	cancelHandler() {
		this.cancel.emit(null);
	}
}

