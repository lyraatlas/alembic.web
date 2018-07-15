import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { AlertType, EditControlMode } from '../../../enumerations';
import { ErrorEventBus } from '../../../event-buses';
import { IBucket } from '../../../models';
import { AlertService, UserService } from '../../../services';
import { BucketService } from '../../../services/bucket.service';

@Component({
  selector: 'app-bucket-edit-control',
  templateUrl: './bucket-edit-control.component.html',
  styleUrls: ['./bucket-edit-control.component.scss']
})
export class BucketEditControlComponent implements OnInit {

    @Input() bucket: IBucket;
    @Input() mode: EditControlMode;
    @Output() bucketChanged = new EventEmitter();
    @Output() cancel = new EventEmitter();
    @Output() bucketSaved = new EventEmitter<IBucket>();

    public editControlMode = EditControlMode;

    constructor(public bucketService: BucketService,
        private errorEventBus: ErrorEventBus,
        public ngxSmartModalService: NgxSmartModalService,
        public alertService: AlertService,
        public userService: UserService,
    ) { }

  ngOnInit() {
      EditControlMode.create
  }

  cancelHandler(){
    this.cancel.emit(null);
  }

  saveBucket(isValid: boolean) {
      if(isValid){
        switch (+this.mode) {
            case +EditControlMode.create:
                  this.bucketService.create(this.bucket).subscribe((response: IBucket) => {
  
                      this.alertService.send({text : `Created new Bucket Board: ${this.bucket.name}.`, alertType : AlertType.success}, true);
                      this.ngxSmartModalService.close("quickEditBucketModal");
  
                      this.bucketSaved.emit(response);
  
                  }, error => {
                      this.errorEventBus.throw(error);
                  });
                break;
            case +EditControlMode.edit:
            this.bucketService.update(this.bucket, this.bucket._id).subscribe(response => {
                this.alertService.send({text : 'Successfully Saved.', alertType : AlertType.success}, false);
                this.ngxSmartModalService.close("quickEditBucketModal");
                this.bucketSaved.emit(this.bucket);
            }, error => {
                this.errorEventBus.throw(error);
            });
            default:
                break;
        }
      }
}

}
