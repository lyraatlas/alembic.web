import { Component, OnInit } from '@angular/core';
import { ErrorEventBus } from '../../../event-buses';
import { IBucket } from '../../../models';
import { BucketService } from '../../../services/bucket.service';
import { ModalInitializer } from '../../shared/utilities/ModalInitializer';


@Component({
    selector: 'app-bucket-list',
    templateUrl: './bucket-list.component.html',
    styleUrls: ['./bucket-list.component.scss'],
})
export class BucketListComponent implements OnInit {

    public buckets: Array<IBucket>;
    constructor(public bucketService: BucketService, private errorEventBus: ErrorEventBus) { }

    ngOnInit() {
        this.bucketService.getMyList().subscribe((items: Array<IBucket>) => {
            this.buckets = items;
            //console.dir(items);
        }, error => {
            this.errorEventBus.throw(error);
        });

        ModalInitializer.InitializeModals();
    }
}
