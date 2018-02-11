import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes } from 'ngx-uploader';
import { Headers } from '@angular/http';
import * as enums from '../../../enumerations';
import { CONST } from '../../../constants';
import { AlertService } from '../../../services/index';
import { environment } from '../../../environments/environment';
import { ProductImageEventBus } from '../../../event-buses/index';

interface FormData {
  concurrency: number;
  autoUpload: boolean;
  verbose: boolean;
}

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.sass']
})
export class ImageUploaderComponent implements OnInit {

  @Input() relatedId: string;
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;

  constructor(private alertService: AlertService, private productImageEventBus: ProductImageEventBus) {
    this.formData = {
      concurrency: 1,
      autoUpload: false,
      verbose: true
    };

    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }

  public ngOnInit() {

  }

  onUploadOutput(output: UploadOutput): void {
    console.log(output);

    if (output.type === 'allAddedToQueue') {
      this.startUpload();
    } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') {
      this.files.push(output.file);
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.files[index] = output.file;
    } else if (output.type === 'removed') {
      this.files = this.files.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    } else if (output.type === 'done'){
        this.productImageEventBus.uploadProductImage();
        this.uploadInput.emit({ type: 'remove', id: output.file.id });
      if(output.file.responseStatus != 200){
        this.alertService.send({ text: 'There was an error with the image upload', notificationType: enums.AlertType.danger }, true);
      }
    }

  }

  startUpload(): void {
    if(!this.relatedId){
      this.alertService.send({ text: 'You have to save the product before you can upload images.', notificationType: enums.AlertType.warning }, true);
    }else{
      const event: UploadInput = {
        type: 'uploadAll',
        url: `${environment.apiEndpoint}${environment.V1}${CONST.ep.BUCKETS}/upload-images/${this.relatedId}`,
        method: 'POST',
        concurrency: this.formData.concurrency,
        headers: {
          //'Content-Type': enums.MimeType.MULTIPART,
          'x-access-token': localStorage.getItem(CONST.CLIENT_TOKEN_LOCATION)
        },
      };
  
      this.uploadInput.emit(event);
    }
  }

  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }

  removeFile(id: string): void {
    this.uploadInput.emit({ type: 'remove', id: id });
  }

  removeAllFiles(): void {
    this.uploadInput.emit({ type: 'removeAll' });
  }
}

