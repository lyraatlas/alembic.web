import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileSystemDirectoryEntry, FileSystemFileEntry, UploadEvent, UploadFile } from 'ngx-file-drop';
import { ErrorEventBus } from '../../../event-buses';
import { AlertService, BucketService, UserService } from '../../../services';

@Component({
  selector: 'app-bucket-item-quick-edit',
  templateUrl: './bucket-item-quick-edit.component.html',
  styleUrls: ['./bucket-item-quick-edit.component.scss']
})
export class BucketItemQuickEditComponent implements OnInit {

    //Upload Images Control
    public files: UploadFile[] = [];

  constructor(        private bucketService: BucketService,
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
 
  public fileOver(event){
    console.log(event);
  }
 
  public fileLeave(event){
    console.log(event);
  }
}
