import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { SearchBarEventType } from '../enumerations';

export interface ISearchBarEvent {
	query: string,
	eventType: SearchBarEventType,
}

@Injectable()
export class SearchBarEventBus {
	private SearchBarChangedSource = new Subject<ISearchBarEvent>();
	public SearchBarChanged$ = this.SearchBarChangedSource.asObservable();

	constructor() { };

	public startSearch(query: string) {
		this.emitMessage(query, SearchBarEventType.searched);
	}

	public beginNavigate(query: string) {
		this.emitMessage(query, SearchBarEventType.navigated);
	}

	private emitMessage(query: string, eventType: SearchBarEventType) {
		this.SearchBarChangedSource.next({
			eventType: eventType,
			query: query,
		})
	}
}