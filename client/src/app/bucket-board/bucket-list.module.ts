import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DataTablesModule } from 'angular-datatables';
import { Ng2CompleterModule } from "ng2-completer";
import { FileDropModule } from 'ngx-file-drop';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { NgUploaderModule } from 'ngx-uploader';
import { ImageUploaderModule } from '../shared/image-uploader/image-uploader.module';
import { LaDndDirective } from '../shared/la-dnd/la-dnd.directive';
import { BucketListRoutes } from './bucket-list.routing';
import { BucketDetailComponent } from './buckets/bucket-detail/bucket-detail.component';
import { BucketEditControlComponent } from './buckets/bucket-edit-control/bucket-edit-control.component';
import { BucketListComponent } from './buckets/bucket-list/bucket-list.component';
import { BucketItemQuickEditComponent } from './items/bucket-item-quick-edit/bucket-item-quick-edit.component';

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
        FontAwesomeModule,
        FileDropModule,
    ],
    declarations: [
        BucketListComponent,
        BucketDetailComponent,
        BucketEditControlComponent,
        BucketItemQuickEditComponent,
        LaDndDirective
    ]
})
export class BucketListModule { }
