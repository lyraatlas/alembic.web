import { Component, OnInit, EventEmitter, Input, ViewChild, OnChanges, AfterViewInit, AfterViewChecked } from '@angular/core';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes } from 'ngx-uploader';
import { Headers } from '@angular/http';
import * as enums from '../../../../enumerations';
import { CONST } from '../../../../constants';
import { AlertService, ProductService } from '../../../../services/index';
import { environment } from '../../../../environments/environment';
import { IProduct, IImage } from '../../../../models/index';
import { ActivatedRoute } from '@angular/router';
import { ErrorEventBus, ProductImageEventBus } from '../../../../event-buses/';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-product-image-grid',
  templateUrl: './product-image-grid.component.html',
  styleUrls: []
})
export class ProductImageGridComponent {
  @Input() product: IProduct;

  private tableInitialized: boolean = false;

  // Images Table properties
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  public dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    search: {
      searchPlaceholder: 'Search Products',
      caseInsensitive: true
    }
  };

  public dtTrigger: Subject<any> = new Subject();

  public imageHeaders: string[] = ['Image', 'Url', 'Order', 'Is Active?', 'Actions']

  constructor(private route: ActivatedRoute,
    private errorEventBus: ErrorEventBus,
    private productService: ProductService,
    private alertService: AlertService, private productImageEventBus: ProductImageEventBus) {
  }

  filterImages(image: IImage) {
    if (image) {
      image.variations.forEach(variation => {
        if(variation.type === enums.ImageType.thumbnail){
          image['url'] = variation.url;
        }
      });
      return true;
    }
  }

  editImage(id: string) {
   let image = this.product.images.find(image =>{
      return image._id == id;
    });

    this.productImageEventBus.editProductImage(image, this.product);
  }

  deleteImage(id: string) {
    this.productService.deleteProductImage(this.product._id, id).subscribe(response => {
      this.alertService.send({ text: `Product Images removed: ${this.product.displayName}`, notificationType: enums.AlertType.success }, true);

      let remainingImages = this.product.images.filter((image) => {
        return image._id != id;
      });
      this.product.images = remainingImages;
    });
  }
}
