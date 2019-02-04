import { Routes } from '@angular/router';
import { SearchResultsComponent } from './search-results/search-results.component';

export const SearchResultsRoutes: Routes = [{
	path: '',
	component: SearchResultsComponent,
},
{
	path: 'results/:query',
	component: SearchResultsComponent
}
];
