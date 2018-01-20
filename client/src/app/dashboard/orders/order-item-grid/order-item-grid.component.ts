import { Component, OnInit, EventEmitter, Input, ViewChild, OnChanges, AfterViewInit, AfterViewChecked } from '@angular/core';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes } from 'ngx-uploader';
import { Headers } from '@angular/http';
import * as enums from '../../../../enumerations';
import { CONST } from '../../../../constants';
import { AlertService, OrderService } from '../../../../services/index';
import { environment } from '../../../../environments/environment';
import { IOrder, IImage } from '../../../../models/index';
import { ActivatedRoute } from '@angular/router';
import { ErrorEventBus, OrderItemEventBus } from '../../../../event-buses/';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-order-item-grid',
  templateUrl: './order-item-grid.component.html',
  styleUrls: []
})
export class OrderItemGridComponent {
  @Input() order: IOrder;

  private tableInitialized: boolean = false;

  // Order Item Table properties
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  public dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    search: {
      searchPlaceholder: 'Search Orders',
      caseInsensitive: true
    }
  };

  public dtTrigger: Subject<any> = new Subject();

  public orderItemHeaders: string[] = ['Id', 'Product Id' , 'Quantity', 'Price', 'Actions']

  constructor(private route: ActivatedRoute,
    private errorEventBus: ErrorEventBus,
    private orderService: OrderService,
    private alertService: AlertService,
    private orderItemEventBus: OrderItemEventBus
    ) {  
      
    }

  editItem(id: string) {
   let item = this.order.items.find(item =>{
      return item._id == id;
    });

    this.orderItemEventBus.editOrderItem(item, this.order);
  }

  deleteItem(id: string) {
    let remaingItems = this.order.items.filter((item) => {
        return item._id != id;
      });
      this.order.items = remaingItems;
  }
}
