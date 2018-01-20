import { Routes } from '@angular/router';

import { OverviewComponent } from './overview/overview.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { SupplierListComponent } from './suppliers/supplier-list/supplier-list.component';
import { SupplierDetailComponent } from './suppliers/supplier-detail/supplier-detail.component';
import { OrderListComponent } from './orders/order-list/order-list.component';
import { OrderDetailComponent } from './orders/order-detail/order-detail.component';

export const DashboardRoutes: Routes = [{
    path: '',
    component: OverviewComponent,
    children: [{
        path: 'overview',
        component: OverviewComponent
    }]
},
{
    path: 'products/list',
    component: ProductListComponent,
},
{
    path: 'products/detail/new',
    component: ProductDetailComponent,
},
{
    path: 'products/detail/:id',
    component: ProductDetailComponent,
},
{
    path: 'suppliers/list',
    component: SupplierListComponent,
},
{
    path: 'suppliers/detail/new',
    component: SupplierDetailComponent,
},
{
    path: 'suppliers/detail/:id',
    component: SupplierDetailComponent,
},
{
    path: 'orders/list',
    component: OrderListComponent,
},
{
    path: 'orders/detail/new',
    component: OrderDetailComponent,
},
{
    path: 'orders/detail/:id',
    component: OrderDetailComponent,
}
];
