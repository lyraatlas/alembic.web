import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BucketListComponent } from './bucket-list/bucket-list.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { ImageUploaderModule } from '../shared/image-uploader/image-uploader.module'
import { NgUploaderModule } from 'ngx-uploader';
import { Ng2CompleterModule } from "ng2-completer";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BucketListRoutes } from './bucket-list.routing';
import { BucketDetailComponent } from './bucket-detail/bucket-detail.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(BucketListRoutes),
        FormsModule,
        DataTablesModule,
        ImageUploaderModule,
        NgUploaderModule,
        Ng2CompleterModule,
        NgxDatatableModule
    ],
    declarations: [
        BucketListComponent,
        BucketDetailComponent
    ]
})
export class BucketListModule { }
