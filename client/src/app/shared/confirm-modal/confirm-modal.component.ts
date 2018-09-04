import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgxSmartModalComponent, NgxSmartModalService } from '../../../../node_modules/ngx-smart-modal';

@Component({
	selector: 'app-confirm-modal',
	templateUrl: './confirm-modal.component.html',
	styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {

	@Output() confirmed = new EventEmitter();
	@Output() cancelled = new EventEmitter();

	@Input() isVisible: boolean = false;

	@ViewChild('childModal') childModal: NgxSmartModalComponent;

	private item: any = null;

	constructor(public ngxSmartModalService: NgxSmartModalService, ) { }

	ngOnInit() {
	}

	public show(item: any) {
		this.item = item;
		this.childModal.open();
	}

	public confirm() {
		this.confirmed.emit(this.item);
		this.childModal.close();
	}

	public cancel() {
		this.cancelled.emit();
		this.childModal.close();
	}
}
