import { Component, OnInit } from '@angular/core';
import { faComment } from '@fortawesome/free-solid-svg-icons';
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

    public faComment = faComment;

    public buckets: Array<IBucket>;
    public quickEditBucket: IBucket;
    constructor(public bucketService: BucketService,
        private errorEventBus: ErrorEventBus,
        public ngxSmartModalService: NgxSmartModalService,
        public alertService: AlertService
    ) { }

    public itemsPerRow = 4;
    public bucketTable: Array<Array<IBucket>> = new Array();

    ngOnInit() {
        this.bucketService.getMyList().subscribe((items: Array<IBucket>) => {

            this.buckets = items;

            const numberOfRows = Math.ceil(this.buckets.length/this.itemsPerRow);

            for (let i = 0; i < numberOfRows; i++) {
                this.bucketTable[i] = new Array<IBucket>();
            }

            // Now we're going to build up a list of rows.  we're going to put 4 items in each row.
            
            let currentBucketIndex = 0;

            for (let i = 0; i < numberOfRows; i++) {
                for (let slotNumber = 0; slotNumber < this.itemsPerRow; slotNumber++) {
                    this.bucketTable[i][slotNumber] = this.buckets[currentBucketIndex];
                    ++currentBucketIndex;
                }
            }

            console.dir(this.bucketTable);

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
