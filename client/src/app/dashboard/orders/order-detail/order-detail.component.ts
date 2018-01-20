import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { OrderService, AlertService, WooCommerceService, SupplierService } from '../../../../services/index';
import { IOrder,IEmail, ISupplier, IOrderItem, IProduct } from '../../../../models/index';
import { ErrorEventBus } from '../../../../event-buses/error.event-bus';
import * as enums from '../../../../enumerations';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { Customer, Order } from '../../../../models/woo/index';
import { CompleterService, CompleterData, CompleterCmp } from 'ng2-completer';
import { OrderItemEventBus } from '../../../../event-buses/index';
import { OrderItemGridComponent } from '../order-item-grid/order-item-grid.component';
import { OrderItemEventType, OrderStatus } from '../../../../enumerations';
import { ProductUtil } from '../../../../classes/product.util';
declare var $: any;

export interface SupplierSearchData{
  name: string,
  slug: string,
  id: string, 
}

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
// Commentary
  public currentOrderId: string;
  public order: IOrder;

  public wooCustomer: Customer;
  public wooOrder: Order;
  public wooProductHeaders:string[] = ['View on Market','Name', 'Product ID','Price', 'Quantity', 'Total'];

  // Supplier Type ahead searching
  public searchStr: string;
  public dataService: CompleterData;
  protected searchData: SupplierSearchData[] = null;
  protected selectedSupplierId: string;
  @ViewChild("supplierDDL") private supplierDropDown: CompleterCmp;

  public selectPickerNeedsStartup: boolean = true;
  public orderStatus = enums.OrderStatus;
  // We need to setup a workflow for orders.
  //public currentOrderStatus = this.order && this.order.status ? this.order.status : enums.OrderStatus.entered;

  constructor(private route: ActivatedRoute,
    private errorEventBus: ErrorEventBus,
    private orderService: OrderService,
    private alertService: AlertService,
    private wooService: WooCommerceService,
    private completerService: CompleterService,
    private supplierService: SupplierService,
    private orderItemEventBus: OrderItemEventBus
  ) {
    orderItemEventBus.orderItemChanged$.subscribe(orderItemChanged =>{
      if(orderItemChanged.eventType === OrderItemEventType.saved){
        this.fetchOrder();
      }
    })
  }

  // entered = 1,
  // sent = 2,
  // accepted = 3,
  // rejected = 4,
  // pickedUp = 5,
  // delivered = 6,
  // completed = 7
  changeOrderStatusNext(destinationStatus: OrderStatus){
    this.order.status = destinationStatus;
    this.orderService.update(this.order,this.order._id)
    .flatMap(order =>{
      return this.orderService.moveOrderForward(this.order, destinationStatus);
    })
    .subscribe(order =>{
      this.order = order;
      this.fetchOrder();
    });
  }

  changeOrderStatusPrevious(destinationStatus: OrderStatus){
    this.order.status = destinationStatus;
    this.orderService.update(this.order,this.order._id)
    .subscribe(order =>{
      this.order = order;
    });
  }

  public onSupplierSelected(selected: any) {
    console.log('About to set the supplier ID.')
    if (selected) {
      console.log('Setting the supplierID');
      this.order.supplier = selected.originalObject.id;
    } else {
      console.log('Removing the supplier ID');
      this.order.supplier = '';
    }
  }

  ngOnInit() {
    this.supplierService.getList().subscribe((suppliers: ISupplier[]) =>{
      this.searchData = suppliers.map( supplier =>{
        return { 
          name: supplier.name,
          slug: supplier.slug,
          id: supplier._id, 
        }
      });
      this.dataService = this.completerService.local(this.searchData, 'name,slug', 'name');    
    });

    this.route.params.subscribe(params => {
      // if there isn't an id then it's a new order.
      if (params['id']) {
        this.currentOrderId = params['id'];
        this.fetchOrder();
      }
      else {
        this.order = {
           status: enums.OrderStatus.entered,
        };
        this.order.items = [];
      }
    });
  }

  addOrderItem(){
    let orderItem:IOrderItem = {};
    this.orderItemEventBus.addNewOrderItem(orderItem, this.order);
  }

  fetchOrder() {
    this.orderService.get(this.currentOrderId).subscribe((order: IOrder) => {
      // If they came back from the API as undefined we have to set them, otherwise the onChange bindings won't work.
      if(order && order.items == undefined){
        order.items = [];
      }

      if(order.supplier){
        this.supplierDropDown.value = (order.supplier as ISupplier).name;
        this.supplierDropDown.writeValue((order.supplier as ISupplier).name);
      }

      this.selectPickerNeedsStartup = true;
      //  Init Bootstrap Select Picker
      $(".selectpicker").selectpicker({
        iconBase: "ti",
        tickIcon: "ti-check"
      });

      this.order = order;

      for (let i = 0; i < order.items.length; i++) {
        const orderItem = order.items[i];
        ProductUtil.setThumbnailUrl(orderItem.product as IProduct);
      }

      if(this.order && this.order.wooOrderNumber){
        this.getWooCommerceDetails();
      }
    }, error => {
      this.errorEventBus.throw(error);
    });
  }

  saveOrder(changes: IOrder, isValid: boolean) {
    if (isValid) {
      // This is for when we're trying to create a new order.
      if (this.order._id === undefined) {
        this.orderService.create(this.order).subscribe(response => {
          this.order = response;
          this.currentOrderId = this.order._id;
          this.alertService.send({ text: `Order created: ${this.order.code}`, notificationType: enums.AlertType.success }, true);
        }, error => {
          this.errorEventBus.throw(error);
        });
      }
      // This is for when we're saving an existing order.
      else {
        this.orderService.update(this.order, this.order._id).subscribe(response => {

          this.alertService.send({ text: `Order saved: ${this.order.code}`, notificationType: enums.AlertType.success }, true);

          this.order = response;

        }, error => {
          this.errorEventBus.throw(error);
        });
      }
    }
  }

  getWooCommerceDetails(){
    this.wooService.getOrder(Number(this.order.wooOrderNumber))
    .map(wooOrder =>{
      this.order.total = Number(wooOrder.total);
      this.order.tax = Number(wooOrder.total_tax);
      this.wooOrder = wooOrder;
      this.getProductVirtuals();
      return wooOrder;
    })
    .flatMap(wooOrder =>{
      console.log('About to fetch customer');
      if(wooOrder && wooOrder.customer_id){
        console.log('Fetching customer');
        this.order.wooCustomerId = wooOrder.customer_id.toString();
        return this.wooService.getCustomer(wooOrder.customer_id);
      }
    })
    .subscribe(wooCustomer => {
      this.wooCustomer = wooCustomer;
    }, error => {this.errorEventBus.throw(error)});
  }


  private getProductVirtuals(){
    if(this.wooOrder.line_items && this.wooOrder.line_items.length > 0){
      for (let i = 0; i < this.wooOrder.line_items.length; i++) {
        let lineItem = this.wooOrder.line_items[i];
        //Now we're going to go fetch the product images for our grid.
        const wooProduct = this.wooService.getProduct(lineItem.product_id).subscribe(product =>{

          // This is the format for images that are stored up in wordpress.  so we're tacking on the -150 to get the thumbnail version of the first image in the list.
          //src="//staging.alembic.com/app/uploads/2017/06/PinkPeony_3-150x150.jpg" >
          lineItem.image_url = product.images[0].src.replace('.jpg', '').concat('-150x150.jpg');
          lineItem.permalink = product.permalink;
        }, error => {this.errorEventBus.throw(error)});
      }
    }
  }

  ngAfterViewChecked() {
    if (this.selectPickerNeedsStartup) {
      $('.selectpicker').selectpicker('refresh');
      this.selectPickerNeedsStartup = false;
    }
  }

}
