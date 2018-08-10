import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faCameraRetro, faPlusSquare, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { EditControlMode, UploadStatus } from '../../../../enumerations';
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
export class BucketItemQuickEditComponent implements OnInit {

  @Output() bucketItemChanged = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() bucketItemSaved = new EventEmitter<IBucketItem>();

  @Input() bucket: IBucket;
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

  constructor(private bucketService: BucketService,
    private errorEventBus: ErrorEventBus,
    public alertService: AlertService,
    public userService: UserService,
    private route: ActivatedRoute,
    private bucketItemService: BucketItemService,
    private router: Router) { }

  ngOnInit() {

  }

  public onFilesSelected(e: any) {
    let selectedFiles: Array<File> = this.fileInput.nativeElement.files;
    this.processFiles(selectedFiles);
  }

  public onFilesDropped(files: Array<File>) {
    this.processFiles(files);
  }

  public processFiles(files: Array<File>) {

    // We want to handle the processing first.
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file && this.validateFileType(file.type)) {

        this.uploadFiles.push({
          file: file,
          status: UploadStatus.pending,
          statusText: "Uploading",
        });
      }
    }


    // if we haven't created this bucket item yet, then we need to create it first.
    if (this.currentBucketItem == null ||!this.currentBucketItem._id || this.currentBucketItem._id == '') {

      this.bucketItemService.create(this.currentBucketItem).subscribe(createdItem => {

        this.currentBucketItem = createdItem;

        // There's a certain order of operations we need to take if this bucket item is new.
        if (!this.bucket.bucketItems) {
          this.bucket.bucketItems = new Array<string>();
        }

        // Now add the bucket item id to the array on the bucket.
        (this.bucket.bucketItems as string[]).push(createdItem._id);

        this.pushImagesToServer();

        // After the image has been uploaded we wante to update the bucket with the newly created id.
        this.bucketService.update(this.bucket, this.bucket._id).subscribe(item => {
          this.bucket = item;

          //Now after all this, let's get the updated bucketItem
          this.bucketItemService.get(createdItem._id).subscribe(item => {
            this.currentBucketItem = item;
          }, error => {
            this.errorEventBus.throw(error);
          });

        }, error => {
          this.errorEventBus.throw(error);
        });

      }, error => {
        this.errorEventBus.throw(error);
      });
    } else {
      this.pushImagesToServer();
    }
  }

  pushImagesToServer() {
    let imageUploads: Observable<IBucketItem>[] = [];

    for (let i = 0; i < this.uploadFiles.length; i++) {
      imageUploads.push(this.bucketItemService.uploadImage(this.uploadFiles[i].file, this.currentBucketItem._id));
    }

    Observable.concat(...imageUploads).subscribe(item =>{
      this.currentBucketItem = item;
      console.log('Image Added');
    });
  }

  saveBucketItem(isValid: boolean) {
    if (isValid) {
      if (!this.bucket.bucketItems) {
        this.bucket.bucketItems = new Array<string>();
      }
      if (this.currentBucketItem._id) {
        this.bucketItemService.update(this.currentBucketItem, this.currentBucketItem._id).subscribe(item => {
          this.currentBucketItem = item;
          this.bucketItemSaved.emit(this.currentBucketItem);
        }, error => {
          this.errorEventBus.throw(error);
        });
      } else {
        // First we go in and create the bucket item.  Then we're going to update the bucket with the new bucket item.
        this.bucketItemService.create(this.currentBucketItem).subscribe(createdItem => {

          this.currentBucketItem = createdItem;

          (this.bucket.bucketItems as string[]).push(createdItem._id);

          this.bucketService.update(this.bucket, this.bucket._id).subscribe(item => {
            this.bucket = item;
            this.bucketItemSaved.emit(createdItem);
          }, error => {
            this.errorEventBus.throw(error);
          });

        }, error => {
          this.errorEventBus.throw(error);
        });
      }
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

  public fileOver(event) {
    console.log(event);
  }

  public fileLeave(event) {
    console.log(event);
  }

  cancelHandler() {
    this.cancel.emit(null);
  }
}

export class UploadFile {
  public file: File;
  public status: UploadStatus;
  public statusText: string;
}
