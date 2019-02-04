import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { SearchBarEventType } from '../../../enumerations';
import { SearchBarEventBus } from '../../../event-buses/search-bar.event-bus';

@Component({
	selector: 'app-search-bar',
	templateUrl: './search-bar.component.html',
	styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

	public searchText: string;
	public faSearch = faSearch;

	constructor(private route: ActivatedRoute,
		private router: Router,
		private searchBarEventBus: SearchBarEventBus
	) {
		searchBarEventBus.SearchBarChanged$.subscribe
	}

	searchHandler() {
		this.searchBarEventBus.startSearch(this.searchText);
		this.router.navigate(['/search-results/results/', this.searchText]);
	}

	ngOnInit() {
		this.searchBarEventBus.SearchBarChanged$.subscribe(message => {
			switch (+message.eventType) {
				case +SearchBarEventType.navigated:
					this.searchText = '';
					break;
				default:
					break;
			}
		});
	}

}
