import { Component, OnInit, NgZone, OnChanges, ChangeDetectorRef, SimpleChanges, ViewChild } from '@angular/core';
import { OrderService, AlertService } from '../../../../services/';
import { IOrder } from '../../../../models/index';
import { ErrorEventBus } from '../../../../event-buses/';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AlertType, OrderStatus, EnumHelper } from '../../../../enumerations';
import { TableColumn } from '@swimlane/ngx-datatable';

declare let $: any;
declare let swal: any;

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  public orders: IOrder[] = []; // initializing it to an empty array prevents it from erroring on lenght is undefined.

  public rows = [];
  columns :TableColumn[] = [
    { prop: '_id', name: 'Id'},
    { name: 'Number', prop: 'orderNumber'},
    { name: 'Code'},
    { name: 'Status'},
    { name: 'Notes'},
    { name: 'Total'},
    { name: 'Supplier Name', prop: 'supplier.name'},
    { name: 'Actions', prop: '_id'},
  ];

  constructor(public orderService: OrderService, private alertService: AlertService, private errorEventBus: ErrorEventBus, private router: Router) { }

  ngOnInit() {
    this.getOrders(false);

    // This will scroll us back up to the top when you navigate back to this page from detail views.
    this.router.events.filter(event => event instanceof NavigationEnd).subscribe(() => {
      window.scrollTo(0, 0);
    });
  }

  createOrder() {
    this.router.navigate(['dashboard/orders/detail/new']);
  }


  approveOrder(order: IOrder) {
    // if (!order.isApproved) {
    //   order.isApproved = true;
    //   this.orderService.update(order, order._id).subscribe(response => {
    //     this.alertService.send({ text: "Order Successfully Approved", notificationType: NotificationType.success });
    //     this.getOrders(false);
    //   });
    // }
    // else {
    //   order.isApproved = false;
    //   this.orderService.update(order, order._id).subscribe(response => {
    //     this.alertService.send({ text: "Order Successfully Un-Approved", notificationType: NotificationType.warning });
    //     this.getOrders(false);
    //   });
    // }
  }

  delete(id: string) {
    swal({
      title: 'Delete this Order?',
      text: "This can't be reverted",
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Delete',
      buttonsStyling: false
    }).then(() => {
      // Hit the order service, and delete it.
      this.orderService.delete(id).subscribe((response) => {
        this.alertService.send({ text: "Order Successfully Deleted", notificationType: AlertType.success });
        this.getOrders(false);
      }, error => {
        this.errorEventBus.throw(error);
      });
    });
  }

  edit(id: string) {
    this.router.navigate(['dashboard/orders/detail/', id]);
  }

  getOrders(notifyUser: boolean) {
    // When this control starts, go get the entities.
    this.orderService.getList<IOrder>().subscribe(orders => {
      this.orders = orders;
      this.setupVirtuals();
      if (notifyUser) {
        this.alertService.send({ text: "Order List Refreshed", notificationType: AlertType.success });
      }
    }, error => {
      this.errorEventBus.throw(error);
    });
  }

  setupVirtuals(){
    for (let i = 0; i < this.orders.length; i++) {
      const order = this.orders[i];
      order['statusName'] = OrderStatus[order.status];
    }
  }

  editSupplier(id:string){
    this.router.navigate(['dashboard/suppliers/detail/', id]);
  }

  refreshOrders() {
    this.getOrders(true);
  }

}
