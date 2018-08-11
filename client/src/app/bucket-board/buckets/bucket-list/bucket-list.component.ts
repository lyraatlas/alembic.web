import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faComment, faHeart, faPen, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { EditControlMode } from '../../../../enumerations';
import { ErrorEventBus } from '../../../../event-buses';
import { IBucket } from '../../../../models';
import { AlertService, BucketService, LikeableServiceMixin, UserService } from '../../../../services';


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
  private originalName: string;
  private originalDesc: string;
  public editControlMode: EditControlMode;

  public buckets: Array<IBucket>;
  public quickEditBucket: IBucket;
  constructor(
    private bucketService: BucketService,
    private errorEventBus: ErrorEventBus,
    public ngxSmartModalService: NgxSmartModalService,
    public alertService: AlertService,
    public userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  public itemsPerRow = 4;
  public bucketTable: Array<Array<IBucket>> = new Array();


  ngOnInit() {
    this.loadBuckets();
  }

  loadBuckets() {
    this.bucketService.getMyList().subscribe((items: Array<IBucket>) => {

      this.buckets = items;

      LikeableServiceMixin.calculateLikeStatus(this.buckets);

      const numberOfRows = Math.ceil(this.buckets.length / this.itemsPerRow);

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

    }, error => {
      this.errorEventBus.throw(error);
    });
  }

  createBucket() {
    this.quickEditBucket = {};
    this.editControlMode = EditControlMode.create;
    this.ngxSmartModalService.open("quickEditBucketModal");
  }

  quickEdit(bucket: IBucket) {
    this.quickEditBucket = bucket;
    this.originalName = bucket.name;
    this.originalDesc = bucket.description;
    this.editControlMode = EditControlMode.edit;
    this.ngxSmartModalService.open("quickEditBucketModal");
  }

  quickEditCancel() {
    this.quickEditBucket.name = this.originalName;
    this.quickEditBucket.description = this.originalDesc;
    this.updateBucketInTable(this.quickEditBucket);
    this.quickEditBucket = null;
    this.ngxSmartModalService.close("quickEditBucketModal");
  }


  addRemoveLike(bucket: IBucket) {
    this.bucketService.liker.toggleLike(bucket, this.errorEventBus).subscribe(item => {
      bucket = item;
      this.updateBucketInTable(bucket);
    });
  }

  updateBucketInTable(bucket: IBucket) {
    for (let j = 0; j < this.bucketTable.length; j++) {
      const row = this.bucketTable[j];
      for (let i = 0; i < row.length; i++) {
        const item = row[i];
        if (item && item._id && item._id == bucket._id) {
          row[i] = bucket;
        }
      }
    }
  }

  canceled() {
    var bucket = this.quickEditBucket;
    bucket.description = this.originalDesc;
    bucket.name = this.originalName;
    this.updateBucketInTable(bucket);
    this.ngxSmartModalService.close("quickEditBucketModal");
  }

  bucketSaved(bucket: IBucket) {
    this.ngxSmartModalService.close("quickEditBucketModal");
    this.updateBucketInTable(bucket);
    this.loadBuckets();
    if (this.editControlMode == EditControlMode.create) {
      this.router.navigate(['/bucket-board/detail', bucket._id]);
    }
  }
}
