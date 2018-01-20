import { Component, OnInit } from '@angular/core';
import { IImage, IImageVariation, IProduct } from '../../../../models/index';
import { ProductImageEventBus } from '../../../../event-buses/index';
import { ProductImageEventType, AlertType } from '../../../../enumerations';
import { ProductService, AlertService } from '../../../../services/';

@Component({
  selector: 'app-product-image-detail',
  templateUrl: './product-image-detail.component.html',
  styleUrls: []
})
export class ProductImageDetailComponent implements OnInit {

  public image: IImage;
  public product: IProduct;

  constructor(private imageEventBus: ProductImageEventBus, private productService: ProductService, private alertService: AlertService) { }

  ngOnInit() {
    this.imageEventBus.productImageChanged$.subscribe(event => {
      if (event.eventType === ProductImageEventType.edited) {
        this.image = event.productImage;
        this.product = event.relatedProduct;
      }
    })
  }

  saveImage(changes: IImage, isValid: boolean) {
    if (isValid) {
      // We really need to take and apply this to any of the images in this same group.
      // find the imageId on the product.
      let oldImage = this.product.images.find(image => {
        return image._id == image._id;
      });

      let currentImage: IImage;

      this.product.images.forEach((image) => {
        if (image._id === this.image._id) {
          image.isActive = this.image.isActive;
          image.order = this.image.order;
          currentImage = image;
        }
      });

      this.productService.update(this.product, this.product._id).subscribe(response => {
        this.alertService.send({ text: 'Successfully updated product image.', notificationType: AlertType.success }, true);
      });

      this.imageEventBus.saveProductImage(currentImage, this.product);

      // This will basically set the ngIf to false, and hide the control.
      this.image = undefined;
      this.product = undefined;
    }
  }

  cancel() {
    // This will basically set the ngIf to false, and hide the control.
    this.image = undefined;
    this.product = undefined;
  }

}
