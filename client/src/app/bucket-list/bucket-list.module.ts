import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DataTablesModule } from 'angular-datatables';
import { Ng2CompleterModule } from "ng2-completer";
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { NgUploaderModule } from 'ngx-uploader';
import { ImageUploaderModule } from '../shared/image-uploader/image-uploader.module';
import { BucketDetailComponent } from './bucket-detail/bucket-detail.component';
import { BucketListRoutes } from './bucket-list.routing';
import { BucketListComponent } from './bucket-list/bucket-list.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(BucketListRoutes),
        FormsModule,
        DataTablesModule,
        ImageUploaderModule,
        NgUploaderModule,
        Ng2CompleterModule,
        NgxDatatableModule,
        NgxSmartModalModule,
        FontAwesomeModule
    ],
    declarations: [
        BucketListComponent,
        BucketDetailComponent
    ]
})
export class BucketListModule { }
