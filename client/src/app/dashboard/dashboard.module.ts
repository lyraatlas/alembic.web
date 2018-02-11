import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { DashboardRoutes } from './dashboard.routing';
import { ImageUploaderModule } from '../shared/image-uploader/image-uploader.module'
import { CallbackFilterPipe } from '../pipes/callback-filter.pipe';
import { NgUploaderModule } from 'ngx-uploader';
import { Ng2CompleterModule } from "ng2-completer";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { HomeComponent } from './home/home.component';


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
        CallbackFilterPipe,
        HomeComponent, 
    ]
})

export class DashboardModule { }
