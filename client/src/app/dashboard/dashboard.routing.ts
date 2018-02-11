import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';

export const DashboardRoutes: Routes = [{
    path: '',
    component: HomeComponent,
    children: [{
        path: 'home',
        component: HomeComponent
    }]
}
];
