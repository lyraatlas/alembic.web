import { Component, OnInit, NgZone, OnChanges, ChangeDetectorRef, SimpleChanges, ViewChild } from '@angular/core';
import { SupplierService, AlertService } from '../../../../services/';
import { ISupplier } from '../../../../models/index';
import { ErrorEventBus } from '../../../../event-buses/';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AlertType } from '../../../../enumerations';
declare let $: any;
declare let swal: any;

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: []
})
export class SupplierListComponent implements OnInit {
  public headers: string[] = ['Id', 'Name', 'Is Approved?', 'Is Active?', 'Slug','Company Phone', 'Pickup Phone', 'Actions']
  public suppliers: ISupplier[];
  public supplierTable;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();

  constructor(public supplierService: SupplierService, private alertService: AlertService, private errorEventBus: ErrorEventBus, private router: Router) { }

  ngOnInit() {
    this.getSuppliers(false);

    // This will scroll us back up to the top when you navigate back to this page from detail views.
    this.router.events.filter(event => event instanceof NavigationEnd).subscribe(() => {
      window.scrollTo(0, 0);
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  rerenderDataTable(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  createSupplier() {
    this.router.navigate(['dashboard/suppliers/detail/new']);
  }


  approveSupplier(supplier: ISupplier) {
    if (!supplier.isApproved) {
      supplier.isApproved = true;
      this.supplierService.update(supplier, supplier._id).subscribe(response => {
        this.alertService.send({ text: "Supplier Successfully Approved", notificationType: AlertType.success });
        this.getSuppliers(false);
      });
    }
    else {
      supplier.isApproved = false;
      this.supplierService.update(supplier, supplier._id).subscribe(response => {
        this.alertService.send({ text: "Supplier Successfully Un-Approved", notificationType: AlertType.warning });
        this.getSuppliers(false);
      });
    }
  }

  delete(id: string) {
    swal({
      title: 'Delete this Supplier?',
      text: "This can't be reverted",
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Delete',
      buttonsStyling: false
    }).then(() => {
      // Hit the supplier service, and delete it.
      this.supplierService.delete(id).subscribe((response) => {
        this.alertService.send({ text: "Supplier Successfully Deleted", notificationType: AlertType.success });
        this.getSuppliers(false);
      }, error => {
        this.errorEventBus.throw(error);
      });
    });
  }

  edit(id: string) {
    this.router.navigate(['dashboard/suppliers/detail/', id]);
  }

  getSuppliers(notifyUser: boolean) {
    // When this control starts, go get the entities.
    this.supplierService.getList<ISupplier>().subscribe(suppliers => {
      this.suppliers = suppliers;
      this.rerenderDataTable();
      this.dtOptions = {
        pagingType: 'full_numbers',
        search: {
          searchPlaceholder: 'Search Suppliers',
          caseInsensitive: true
        }
      };
      if (notifyUser) {
        this.alertService.send({ text: "Supplier List Refreshed", notificationType: AlertType.success });
      }
    }, error => {
      this.errorEventBus.throw(error);
    });
  }

  refreshSuppliers() {
    this.getSuppliers(true);
  }

}
