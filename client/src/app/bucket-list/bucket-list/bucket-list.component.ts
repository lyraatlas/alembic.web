import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { AlertType } from '../../../enumerations';
import { ErrorEventBus } from '../../../event-buses';
import { IBucket } from '../../../models';
import { AlertService } from '../../../services';
import { BucketService } from '../../../services/bucket.service';

@Component({
    selector: 'app-bucket-list',
    templateUrl: './bucket-list.component.html',
    styleUrls: ['./bucket-list.component.scss'],
})
export class BucketListComponent implements OnInit {

    public buckets: Array<IBucket>;
    public quickEditBucket: IBucket;
    constructor(public bucketService: BucketService,
        private errorEventBus: ErrorEventBus,
        public ngxSmartModalService: NgxSmartModalService,
        public alertService: AlertService
    ) { }

    ngOnInit() {
        this.bucketService.getMyList().subscribe((items: Array<IBucket>) => {
            this.buckets = items;
            //console.dir(items);
        }, error => {
            this.errorEventBus.throw(error);
        });
    }

    quickEdit(bucket: IBucket) {
        console.log('about to run quick edit.  This should set the bucket');
        this.quickEditBucket = bucket;
        this.ngxSmartModalService.open("quickEditBucketModal");
    }

    closeModal(){
        this.ngxSmartModalService.close("quickEditBucketModal");
    }

    saveBucket(isValid: boolean) {
        if (isValid) {
            this.bucketService.update(this.quickEditBucket, this.quickEditBucket._id).subscribe(response => {
                this.alertService.send({text : 'Successfully Saved.', alertType : AlertType.success}, false);
                this.ngxSmartModalService.close("quickEditBucketModal");
            }, error => {
                this.errorEventBus.throw(error);
            });
        }
    }
}
