import { IProduct, IImage } from "../models/index";
import * as enums from '../enumerations';

export class ProductUtil {
    static setThumbnailUrls(products: IProduct[]): void {
        for (let i = 0; i < products.length; i++) {
            this.setThumbnailUrl(products[i])
        }
    }

    static setThumbnailUrl(product: IProduct): void {
        if (product && product.images && product.images.length > 0) {
            // If we sort the product images on order, now we can just pull the lowest order image.
            product.images = product.images.sort((a, b) => {
                return a.order - b.order;
            });

            product.thumbnailUrl = this.getImageThumbnailUrl(product.images[0]);
        }
    }

    public static getImageThumbnailUrl(image: IImage): string {
        if (image) {
            for (let i = 0; i < image.variations.length; i++) {
                const variation = image.variations[i];
                if (variation.type === enums.ImageType.thumbnail) {
                    return variation.url;
                }
            }
        }
        return '';
    }
}