import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
    selector: '[appLaDnd]'
})
export class LaDndDirective {
    private allowed_extensions: Array<string> = [
        'png',
        'jpeg',
        'jpg'
    ];

    @Output() public filesChangedEvent: EventEmitter<Array<File>> = new EventEmitter();

    @HostBinding('style.background') private background = '#eee';

    @HostListener('dragover', ['$event']) onDragOver(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.background = '#38dca31a';
        let files = evt.dataTransfer.files;
        if (files.length > 0) {
            //do some stuff here

            console.dir(files);
        }
    }

    @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.background = '#eee';
    }

    @HostListener('drop', ['$event']) public onDrop(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        let files: FileList = evt.dataTransfer.files;
        let validFiles: Array<File> = new Array<File>();
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                let ext = file.name.split('.')[file.name.split('.').length - 1];
                if (this.allowed_extensions.lastIndexOf(ext) != -1) {
                    validFiles.push(file);
                }
            }
            if (validFiles.length > 0) {
                console.log(validFiles);
                this.filesChangedEvent.emit(validFiles);
            }
        }
        this.background = '#eee';
    }

    constructor() { }

}
