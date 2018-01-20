import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ImageUploaderComponent } from './image-uploader.component';
import { NgUploaderModule } from 'ngx-uploader';

@NgModule({
    imports: [ RouterModule, CommonModule, NgUploaderModule  ],
    declarations: [ ImageUploaderComponent],
    exports: [ ImageUploaderComponent ]
})

export class ImageUploaderModule {}
