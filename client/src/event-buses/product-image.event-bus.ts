import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ProductImageEventType } from '../enumerations';
import { IProduct } from '../models';
import { IImage } from '../models/product.interface';
import { AlertService } from '../services';

export interface IProductImageEventMessage{
    productImage: IImage,
    eventType: ProductImageEventType,
    relatedProduct: IProduct,
}

@Injectable()
export class ProductImageEventBus {
    private productImageChangedSource = new Subject<IProductImageEventMessage>();
    
    public productImageChanged$ = this.productImageChangedSource.asObservable();

    // Mostly managed by the product images component.
    public productImages: Array<IImage>;

    constructor(private alertService: AlertService){};

    public addProductImage(productImage: IImage, product: IProduct) {
        this.emitMessage(productImage,ProductImageEventType.added, product);
    }

    public editProductImage(productImage: IImage, product: IProduct){
        this.emitMessage(productImage,ProductImageEventType.edited, product);
    }

    public removeProductImage(productImage: IImage, product: IProduct) {
        this.emitMessage(productImage,ProductImageEventType.removed, product);
    }

    public saveProductImage(productImage: IImage, product: IProduct){
        this.emitMessage(productImage,ProductImageEventType.saved, product);
    }
    
    public uploadProductImage(){
        this.emitMessage(null, ProductImageEventType.uploaded, null);
    }
    
    private emitMessage(productImage: IImage, eventType: ProductImageEventType, product: IProduct){
        this.productImageChangedSource.next({
            eventType: eventType,
            productImage: productImage,
            relatedProduct: product
        })
    }
}