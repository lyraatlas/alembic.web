import { Component, OnInit } from '@angular/core';
import { faComment, faHeart, faPen, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { CONST } from '../../../constants';
import { AlertType } from '../../../enumerations';
import { ErrorEventBus } from '../../../event-buses';
import { IBucket, ITokenPayload } from '../../../models';
import { AlertService, UserService } from '../../../services';
import { BucketService } from '../../../services/bucket.service';

@Component({
    selector: 'app-bucket-list',
    templateUrl: './bucket-list.component.html',
    styleUrls: ['./bucket-list.component.scss'],
})
export class BucketListComponent implements OnInit {

    public faComment = faComment;
    public faHeart = faHeart;
    public faPencilAlt = faPencilAlt;
    public faPen = faPen;

    public buckets: Array<IBucket>;
    public quickEditBucket: IBucket;
    constructor(public bucketService: BucketService,
        private errorEventBus: ErrorEventBus,
        public ngxSmartModalService: NgxSmartModalService,
        public alertService: AlertService,
        public userService: UserService,
    ) { }

    public itemsPerRow = 4;
    public bucketTable: Array<Array<IBucket>> = new Array();

    public userId: string = (JSON.parse(localStorage.getItem(CONST.CLIENT_DECODED_TOKEN_LOCATION))  as ITokenPayload).userId;

    ngOnInit() {
        this.loadBuckets();
    }

    loadBuckets(){
        this.bucketService.getMyList().subscribe((items: Array<IBucket>) => {

            this.buckets = items;

            this.calculateLikeStatus();

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

    calculateLikeStatus(){
        this.buckets.forEach(bucket => {
            // we're going to flag the bucket as to whether the current user has liked this bucket.
            bucket.likedBy.forEach(token=> {
                if(token == this.userId){
                    bucket.isLikedByCurrentUser = true;
                }
            })
        });
    }

    addRemoveLike(bucket:IBucket){
        if(bucket.likedBy.indexOf(this.userId) > -1){
            this.bucketService.removeLike(bucket).subscribe(bucket =>{
                bucket.isLikedByCurrentUser = false;
                this.updateBucketInTable(bucket);
            }, error => {
                this.errorEventBus.throw(error);
            });
        }else{
            this.bucketService.addLike(bucket).subscribe(bucket =>{
                bucket.isLikedByCurrentUser = true;
                this.updateBucketInTable(bucket);
            }, error => {
                this.errorEventBus.throw(error);
            });
        }
    }

    updateBucketInTable(bucket:IBucket){
        for (let j = 0; j < this.bucketTable.length; j++) {
            const row = this.bucketTable[j];
            for (let i = 0; i < row.length; i++) {
                const item = row[i];
                if(item && item._id && item._id == bucket._id){
                    row[i] = bucket;
                }
            }
        }
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
