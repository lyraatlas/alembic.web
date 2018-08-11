import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSmartModalService } from '../../../../node_modules/ngx-smart-modal';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {

  @Output() confirmed = new EventEmitter();
  @Output() cancelled = new EventEmitter();

  @Input() isVisible:boolean = false;

  private item:any = null;

  constructor(public ngxSmartModalService: NgxSmartModalService,) { }

  ngOnInit() {
  }

  public show(item: any){
    this.item = item;
    this.ngxSmartModalService.open("confirmModal");
  }

  public confirm(){
    this.confirmed.emit(this.item);
    this.ngxSmartModalService.close("confirmModal");
  }

  public cancel(){
    this.cancelled.emit();
    this.ngxSmartModalService.close("confirmModal");
  }
}
