import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorEventBus } from '../../../event-buses';
import { IBucket } from '../../../models';
import { BucketService } from '../../../services/bucket.service';

@Component({
    selector: 'app-bucket-detail',
    templateUrl: './bucket-detail.component.html',
    styleUrls: ['./bucket-detail.component.scss']
})
export class BucketDetailComponent implements OnInit {
    public currentBucketId: string;
    public bucket: IBucket;

    constructor(private route: ActivatedRoute, private router: Router, public bucketService: BucketService, private errorEventBus: ErrorEventBus,) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            // if there isn't an id then it's a new product.
            if (params['id']) {
                this.currentBucketId = params['id'];
                this.fetchBucket();
            }
        });
    }

    backToBuckets() {
        this.router.navigate(['/bucket-list']);
    }

    fetchBucket(): any {
        this.bucketService.get(this.currentBucketId).subscribe((bucket: IBucket) => {

            this.bucket = bucket;

        }, error => {
            this.errorEventBus.throw(error);
        });
    }
}
