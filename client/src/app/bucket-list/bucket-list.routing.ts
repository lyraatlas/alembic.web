import { Routes } from '@angular/router';
import { BucketDetailComponent } from './bucket-detail/bucket-detail.component';
import { BucketListComponent } from './bucket-list/bucket-list.component';

export const BucketListRoutes: Routes = [{
    path: '',
    component: BucketListComponent,
},
{
    path: 'detail/:id',
    component: BucketDetailComponent
}
];
