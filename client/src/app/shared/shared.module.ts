import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DataTablesModule } from 'angular-datatables';
import { Ng2CompleterModule } from 'ng2-completer';
import { FileDropModule } from 'ngx-file-drop';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { NgUploaderModule } from 'ngx-uploader';
import { CommentListComponent } from '../shared/comment-list/comment-list.component';
import { ConfirmModalComponent } from '../shared/confirm-modal/confirm-modal.component';
import { LaDndDirective } from '../shared/la-dnd/la-dnd.directive';
import { CommentItemComponent } from './comment-item/comment-item.component';
import { ImageUploaderModule } from './image-uploader/image-uploader.module';
import { ThumbGridComponent } from './thumb-grid/thumb-grid.component';

// So a lot of the shared components are already wrapped in their own module.
// While that's fine, I don't want to have to create a module for every shared component.  So this 
// will wrap the remaining components.
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		DataTablesModule,
		ImageUploaderModule,
		NgUploaderModule,
		Ng2CompleterModule,
		NgxDatatableModule,
		NgxSmartModalModule,
		FontAwesomeModule,
		FileDropModule,
		RouterModule
	],
	declarations: [
		LaDndDirective,
		ConfirmModalComponent,
		CommentListComponent,
		ConfirmModalComponent,
		CommentItemComponent,
		ThumbGridComponent,
	],
	exports: [
		LaDndDirective,
		ConfirmModalComponent,
		CommentListComponent,
		ConfirmModalComponent,
		ThumbGridComponent
	]
})
export class SharedModule { }
