import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faCameraRetro, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
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

    @ViewChild('laFileInput') fileInput: ElementRef;

    // Public enumerations
    public EditControlMode = EditControlMode;
    public faCameraRetro = faCameraRetro;
    public faPlusSquare = faPlusSquare;

    //Upload Images Control
    public files: File[] = [];
    public uploadFiles: Array<UploadFile> = [];
    public controlMode: EditControlMode = EditControlMode.create;
    public bucketItem: IBucketItem = {

    }

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

    public processFiles(files: Array<File>){
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file && this.validateFileType(file.type)) {
                this.files.push(file);
                this.uploadFiles.push({
                    file: file,
                    status: UploadStatus.pending
                });
                if(!this.bucketItem._id || this.bucketItem._id == ''){
                    this.bucketItem.bucketId = this.bucket._id;
                    this.bucketItemService.create(this.bucketItem).subscribe(item =>{
                        this.bucketItem = item;
                        this.bucketItemService.uploadImage(file, item._id).subscribe(res =>{
                            console.log('image Saved');
                        });
                    });
                }else{
                    this.bucketItemService.uploadImage(file, this.bucketItem._id).subscribe(res =>{
                        console.log('image Saved');
                    });
                }
            }
        }
    }

    public validateFileType(type: string){
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

export class UploadFile{
    public file: File;
    public status:  UploadStatus
}
