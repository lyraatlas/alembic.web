import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { IBucketItem } from '../../../../../server/models';
import { ErrorEventBus } from '../../../event-buses';
import { SearchBarEventBus } from '../../../event-buses/search-bar.event-bus';
import { IBucket } from '../../../models';
import { BucketService } from '../../../services';
import { BucketItemService } from '../../../services/bucket-item.service';

@Component({
	selector: 'app-search-results',
	templateUrl: './search-results.component.html',
	styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent implements OnInit, OnDestroy {

	public query: string;
	public buckets: Array<IBucket>;
	public bucketItems: Array<IBucketItem>;
	public faPlusCircle = faPlusCircle;
	public faMinusCircle = faMinusCircle;
	public isBucketsExpanded = true;
	public isBucketItemsExpanded = true;

	constructor(private route: ActivatedRoute,
		private router: Router,
		private bucketService: BucketService,
		private errorEventBus: ErrorEventBus,
		private bucketItemService: BucketItemService,
		private searchBarEventBus: SearchBarEventBus
	) { }

	ngOnDestroy() {
		this.searchBarEventBus.beginNavigate(this.query);
	}

	toggleBuckets(toggle: boolean) {
		console.log('About to toggle');
		this.isBucketsExpanded = toggle;
	}

	ngOnInit() {

		this.route.params.subscribe(async params => {
			// if there isn't an id then it's a new product.
			if (params['query']) {
				this.query = params['query'];

				this.bucketService.query({
					"$text": {
						"$search": this.query,
						"$caseSensitive": false
					}
				}).subscribe((items: Array<IBucket>) => {

					this.buckets = items;

					console.log(this.buckets);
				}, error => {
					this.errorEventBus.throw(error);
				});

				this.bucketItemService.query({
					"$text": {
						"$search": this.query,
						"$caseSensitive": false
					}
				}).subscribe((items: Array<IBucketItem>) => {

					this.bucketItems = items;

				}, error => {
					this.errorEventBus.throw(error);
				});
			}
			console.log(`This query ${this.query}`);
		});
	}
}
