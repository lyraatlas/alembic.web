import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { IImage, IImageVariation, IOrder, IOrderItem, IProduct, ISupplier } from '../../../../models/index';
import { OrderItemEventBus, ErrorEventBus } from '../../../../event-buses/index';
import { AlertType, OrderItemEventType } from '../../../../enumerations';
import { OrderService, AlertService, ProductService } from '../../../../services/';
import { CompleterData, CompleterCmp, CompleterService } from 'ng2-completer';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';

export interface ProductSearchData {
  displayName: string,
  commonName: string,
  id: string,
}

@Component({
  selector: 'app-order-item-detail',
  templateUrl: './order-item-detail.component.html',
  styleUrls: []
})

export class OrderItemDetailComponent implements OnInit {

  public order: IOrder;
  public orderItem: IOrderItem;
  public products: IProduct[];

  // Supplier Type ahead searching
  public searchStr: string;
  public dataService: CompleterData;
  protected searchData: ProductSearchData[];
  protected selectProductId: string;
  @ViewChild("productDDL") public productDropDown: CompleterCmp;

  constructor(
    private orderItemEventBus: OrderItemEventBus,
    private orderService: OrderService,
    private alertService: AlertService,
    private productService: ProductService,
    private completerService: CompleterService,
    private errorEventBus: ErrorEventBus,
  ) { 
    orderItemEventBus.orderItemChanged$.subscribe(message =>{
      if(message.eventType === OrderItemEventType.newAdded){

        this.orderItem = {};
        this.order = message.relatedOrder;
        this.getActiveProductsForSupplier();

      } else if(message.eventType === OrderItemEventType.edited){

        this.orderItem = message.orderItem;
        this.order = message.relatedOrder;
        this.getActiveProductsForSupplier();

        if (this.orderItem && this.orderItem.product) {
          console.log('About to initialize the typeahead drop down for products on order Items.')
          this.productDropDown.value = (this.orderItem.product as IProduct).displayName;
          this.productDropDown.writeValue((this.orderItem.product as IProduct).displayName);
        }
      }
    });
  }

  ngOnInit() {
  }

  public getActiveProductsForSupplier(){
    console.log('Current Order in onInit for order item detail',this.order)
        
    if(this.order){
      console.log('About to query for products that match this supplier');
      this.productService.query({
        isTemplate: false,
        supplier: (this.order.supplier as ISupplier)._id,
      })
      .subscribe((products: IProduct[]) => {

        this.products = products;

        this.searchData = this.products.map(product => {
          return {
            displayName: product.displayName,
            commonName: product.commonName,
            id: product._id
          }
        });

        this.dataService = this.completerService.local(this.searchData, 'displayName,commonName', 'displayName');
      });
    } else{
      this.dataService = this.completerService.local(new Array<ProductSearchData>(), 'displayName,commonName', 'displayName');
    }
  }

  public onProductSelected(selected: any) {
    console.log('About to set the product ID.')
    if (selected && selected.originalObject && selected.originalObject.id) {
      console.log('Setting the product');
      this.orderItem.product = selected.originalObject.id;
      //this.orderItem.price = 
    } else if (this.orderItem && this.orderItem.product) {
      console.log('Removing the product ID');
      this.orderItem.product = '';
    }
  }

  saveOrderItem(changes: IImage, isValid: boolean) {
    if (isValid) {

      // If this orderItem has an id then it's not new so we save it by replacing the original.
      if(this.orderItem._id){
        this.order.items.forEach((item) => {
          if (item._id === this.orderItem._id) {
            item = this.orderItem;
          }
        });
      } else{
        this.order.items.push(this.orderItem);
      }

      this.orderService.update(this.order, this.order._id).subscribe(response => {
        this.alertService.send({ text: 'Successfully updated order item.', notificationType: AlertType.success }, true);

        this.orderItemEventBus.saveOrderItem(this.orderItem, this.order);
        
        // This will basically set the ngIf to false, and hide the control.
        this.orderItem = undefined;
        this.order = undefined;
      }, error => {
        this.errorEventBus.throw(error);
      });
    }
  }

  cancel() {
    // This will basically set the ngIf to false, and hide the control.
    this.orderItem = undefined;
    this.order = undefined;
  }
}
