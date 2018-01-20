import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { OverviewComponent } from './overview/overview.component';
import { DashboardRoutes } from './dashboard.routing';
import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { ImageUploaderModule } from '../shared/image-uploader/image-uploader.module'
import { CallbackFilterPipe } from '../pipes/callback-filter.pipe';
import { NgUploaderModule } from 'ngx-uploader';
import { ProductImageGridComponent } from './products/product-image-grid/product-image-grid.component';
import { ProductImageDetailComponent } from './products/product-image-detail/product-image-detail.component';
import { SupplierListComponent } from './suppliers/supplier-list/supplier-list.component';
import { SupplierDetailComponent } from './suppliers/supplier-detail/supplier-detail.component';
import { OrderDetailComponent } from './orders/order-detail/order-detail.component';
import { OrderListComponent } from './orders/order-list/order-list.component';
import { Ng2CompleterModule } from "ng2-completer";
import { OrderItemDetailComponent } from './orders/order-item-detail/order-item-detail.component';
import { OrderItemGridComponent } from './orders/order-item-grid/order-item-grid.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DashboardRoutes),
        FormsModule,
        DataTablesModule,
        ImageUploaderModule,
        NgUploaderModule,
        Ng2CompleterModule,
        NgxDatatableModule
    ],
    declarations: [
        OverviewComponent, 
        ProductListComponent, 
        ProductDetailComponent, 
        CallbackFilterPipe, ProductImageGridComponent, 
        ProductImageDetailComponent, 
        SupplierListComponent,
        SupplierDetailComponent,
        OrderDetailComponent,
        OrderListComponent,
        OrderItemDetailComponent,
        OrderItemGridComponent
    ]
})

export class DashboardModule { }
