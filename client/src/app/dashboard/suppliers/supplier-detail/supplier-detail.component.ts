import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { SupplierService, AlertService } from '../../../../services/index';
import { ISupplier,IEmail } from '../../../../models/index';
import { ErrorEventBus } from '../../../../event-buses/error.event-bus';
import * as enums from '../../../../enumerations';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
declare var $: any;

@Component({
  selector: 'app-supplier-detail',
  templateUrl: './supplier-detail.component.html',
  styleUrls: []
})
export class SupplierDetailComponent implements OnInit {
// Commentary
  public currentSupplierId: string;
  public supplier: ISupplier;

  constructor(private route: ActivatedRoute,
    private errorEventBus: ErrorEventBus,
    private supplierService: SupplierService,
    private alertService: AlertService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      // if there isn't an id then it's a new supplier.
      if (params['id']) {
        this.currentSupplierId = params['id'];
        this.fetchSupplier();
      }
      else {
        this.supplier = {};
        this.supplier.companyAddress = {};
        this.supplier.pickupAddress = {};
      }
    });
  }

  fetchSupplier() {
    this.supplierService.get(this.currentSupplierId).subscribe((supplier: ISupplier) => {
      // If they came back from the API as undefined we have to set them, otherwise the onChange bindings won't work.
      if(supplier && supplier.companyAddress == undefined){
        supplier.companyAddress = {};
      }
      if(supplier && supplier.pickupAddress == undefined){
        supplier.pickupAddress = {};
      }

      this.supplier = supplier;
    }, error => {
      this.errorEventBus.throw(error);
    });
  }

  saveSupplier(changes: ISupplier, isValid: boolean) {
    if (isValid) {
      // This is for when we're trying to create a new supplier.
      if (this.supplier._id === undefined) {
        this.supplierService.create(this.supplier).subscribe(response => {
          this.supplier = response;
          this.currentSupplierId = this.supplier._id;
          this.alertService.send({ text: `Supplier created: ${this.supplier.name}`, notificationType: enums.AlertType.success }, true);
        }, error => {
          this.errorEventBus.throw(error);
        });
      }
      // This is for when we're saving an existing supplier.
      else {
        this.supplierService.update(this.supplier, this.supplier._id).subscribe(response => {

          console.log(`Saved Supplier ${this.supplier._id}`);

          this.alertService.send({ text: `Supplier saved: ${this.supplier.name}`, notificationType: enums.AlertType.success }, true);

        }, error => {
          this.errorEventBus.throw(error);
        });
      }
    }
  }

  ngAfterViewChecked() {
  }

}
