import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileSystemDirectoryEntry, FileSystemFileEntry, UploadEvent, UploadFile } from 'ngx-file-drop';
import { EditControlMode } from '../../../../enumerations';
import { ErrorEventBus } from '../../../../event-buses';
import { IBucketItem } from '../../../../models/bucket-item.interface';
import { AlertService, BucketService, UserService } from '../../../../services';

@Component({
    selector: 'app-bucket-item-quick-edit',
    templateUrl: './bucket-item-quick-edit.component.html',
    styleUrls: ['./bucket-item-quick-edit.component.scss']
})
export class BucketItemQuickEditComponent implements OnInit {

    // Public enumerations
    public EditControlMode = EditControlMode;

    //Upload Images Control
    public files: UploadFile[] = [];
    public controlMode: EditControlMode = EditControlMode.create;
    public bucketItem: IBucketItem = {

    }

    constructor(private bucketService: BucketService,
        private errorEventBus: ErrorEventBus,
        public alertService: AlertService,
        public userService: UserService,
        private route: ActivatedRoute,
        private router: Router) { }

    ngOnInit() {
    }

    public dropped(event: UploadEvent) {
        this.files = event.files;
        for (const droppedFile of event.files) {

            // Is it a file?
            if (droppedFile.fileEntry.isFile) {

                // 1.  If we have an image file, we need to save the bucket item(create/save) first
                // 2.  Then we can start uploading immediately.
                const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
                fileEntry.file((file: File) => {

                    // Here you can access the real file
                    console.log(droppedFile.relativePath, file);

                    /**
                    // You could upload it like this:
                    const formData = new FormData()
                    formData.append('logo', file, relativePath)
           
                    // Headers
                    const headers = new HttpHeaders({
                      'security-token': 'mytoken'
                    })
           
                    this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
                    .subscribe(data => {
                      // Sanitized logo returned from backend
                    })
                    **/

                });
            } else {
                // It was a directory (empty directories are added, otherwise only files)
                const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
                console.log(droppedFile.relativePath, fileEntry);
            }
        }
    }

    public fileOver(event) {
        console.log(event);
    }

    public fileLeave(event) {
        console.log(event);
    }
}
