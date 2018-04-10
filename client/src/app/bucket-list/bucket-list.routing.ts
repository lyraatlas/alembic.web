import { Routes } from '@angular/router';
import { BucketListComponent } from './bucket-list/bucket-list.component';
import { BucketDetailComponent } from './bucket-detail/bucket-detail.component';

export const BucketListRoutes: Routes = [{
    path: '',
    component: BucketListComponent,
    children: [{
        path: 'detail',
        component: BucketDetailComponent
    }]
}
];
