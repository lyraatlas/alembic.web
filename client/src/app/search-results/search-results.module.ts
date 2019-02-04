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
import { BucketListModule } from '../bucket-board/bucket-list.module';
import { ImageUploaderModule } from '../shared/image-uploader/image-uploader.module';
import { SharedModule } from '../shared/shared.module';
import { SearchResultsRoutes } from './search-results.routing';
import { SearchResultsComponent } from './search-results/search-results.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(SearchResultsRoutes),
		FormsModule,
		DataTablesModule,
		ImageUploaderModule,
		NgUploaderModule,
		Ng2CompleterModule,
		NgxDatatableModule,
		NgxSmartModalModule,
		FontAwesomeModule,
		FileDropModule,
		SharedModule,
		BucketListModule
	],
	declarations: [
		SearchResultsComponent,
	],
	providers: [
	]
})
export class SearchResultsModule { }
