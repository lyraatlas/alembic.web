import { Router, Request, Response, RequestParamHandler, NextFunction, RequestHandler, Application } from 'express';
import mongoose = require('mongoose');
import { Schema, Model, Document } from 'mongoose';
import { Config } from '../../config/config';
import { ITokenPayload, IBaseModelDoc, IHasImages } from '../../models/';
import { CONST } from "../../constants";
import { ApiErrorHandler } from "../../api-error-handler";
import * as rimraf from 'rimraf';
import * as path from 'path';
import * as multer from 'multer';
import * as sharp from 'sharp';
import log = require('winston');
import * as enums from '../../enumerations';
import * as AWS from 'aws-sdk';
import * as fs from 'async-file';
import { MulterFile } from '../../models';
import { AmazonS3Service } from '../../services/index';
import { IImage, IImageVariation } from '../../models/image.interface';
import { BaseRepository } from '../../repositories';
import { BaseController } from './base.controller';
import { BucketController, BucketItemController } from '..';
export type Constructor<T = {}> = new (...args: any[]) => T;

export interface IImageStyle {
    imageType: enums.ImageType;
    height?: number;
    width?: number;
    quality?: number;
    output?: sharp.OutputInfo;
}

export function ImageControllerMixin<TBase extends Constructor>(Base: TBase) {
    return class extends Base {

        public DefaultContentImageStyles: IImageStyle[] = [{
            imageType: enums.ImageType.thumbnail, height: 150, width: 150,
        },
        {
            imageType: enums.ImageType.medium, height: 500,
        },
        {
            imageType: enums.ImageType.large, height: 1024,
        }
        ]

        public static const uploadDirectoryRootLocation: string = '../../../';

        public static async imageTransformer(request: Request, response: Response, next: NextFunction, controller: BaseController, imageStyles: IImageStyle[]) {
            try {
                if (request && request.files && request.files[0]) {
                    // Grab the multer file off the request.  
                    const rawImageFile = request.files[0] as MulterFile;
                    try {
                        //Now we go get the product
                        const itemDoc = await controller.repository.single(request.params['id']);
                        const itemWithImage = itemDoc as IHasImages;

                        const sharpImageDetails: sharp.OutputInfo[] = new Array<sharp.OutputInfo>();

                        for(let imageStyle of imageStyles){
                            imageStyle.output = await this.generateVariation(imageStyle.imageType, rawImageFile, response, imageStyle.width, imageStyle.height, imageStyle.quality);
                        }

                        // figure out what the maximum product image order number is, and add one to it. 
                        const nextOrderNum = this.getNextOrderNumber(itemWithImage) + 10;

                        let image: IImage = {
                            isActive: true,
                            order: nextOrderNum,
                            variations: new Array<IImageVariation>()
                        }

                        imageStyles.forEach(imageStyle => {
                            this.addVariation(image, rawImageFile, imageStyle.output, imageStyle.imageType, nextOrderNum);
                        })

                        // If this is the first image, we're going to create a new array.
                        if (!itemWithImage.images) {
                            itemWithImage.images = new Array<IImage>();
                        }

                        itemWithImage.images.push(image);

                        // Save the updated product.
                        const updatedItem = await controller.repository.save(itemDoc);

                        response.status(200).json(updatedItem);
                    } catch (err) {
                        this.rollbackItemImages(rawImageFile, true, imageStyles);
                        ApiErrorHandler.sendError(`Error during image processing. ${err}`, 500, response, null, err);
                    }
                    finally {
                        this.rollbackItemImages(rawImageFile, false, imageStyles);
                    }
                }
                else {
                    ApiErrorHandler.sendError(`File wasn't present on the request.  Are you sure you sent the file with field named 'file'`, 500, response, null, null);
                }
                // Don't forget to call next here... who knows what the next handler will want to do. 
                next();
            } catch (err) {
                ApiErrorHandler.sendError(`Image Uploading / Resizing failed. Bucket Items - ${err}`, 500, response, null, err);
            }
        }

        public static getNextOrderNumber(product: IHasImages): number {
            if (product && product.images && product.images.length > 0) {
                let max = 0;
                product.images.forEach(image => {
                    max = Math.max(max, image.order);
                });
                return ++max;
            }
            return 0;
        }

        public static addVariation(image: IImage, file: MulterFile, sharpInfo: sharp.OutputInfo, type: enums.ImageType, order: number): IImage {
            image.variations.push({
                type: type,
                height: sharpInfo.height,
                width: sharpInfo.width,
                url: `${Config.active.get('AlembicS3BucketRootUrl')}${Config.active.get('AlembicS3Bucket')}/${AmazonS3Service.variationName(type, file)}`,
                key: AmazonS3Service.variationName(type, file)
            });
            return image;
        }

        public static async generateVariation(
            imageType: enums.ImageType,
            rawImageFile: MulterFile,
            response: Response,
            width: number = null,
            height: number = null,
            quality: number = 80
        ): Promise<sharp.OutputInfo | any> {
            // If you don't turn off cache when you're trying to cleanup the files, you won't be able to deconste the file.
            sharp.cache(false);

            const outputInfo: sharp.OutputInfo = await sharp(path.resolve(__dirname, this.uploadDirectoryRootLocation, `${CONST.IMAGE_UPLOAD_PATH}${rawImageFile.filename}`))
                .resize(width, height)
                .crop(sharp.gravity.center)
                .toFormat(sharp.format.png, {
                    quality: quality,
                })
                .toFile(`${CONST.IMAGE_UPLOAD_PATH}${AmazonS3Service.variationName(imageType, rawImageFile)}`);

            await AmazonS3Service.uploadImageToS3(response, rawImageFile, imageType);

            return outputInfo;
        }

        public static async rollbackItemImages(rawImageFile: MulterFile, cleanS3: boolean, imageStyles: IImageStyle[]) {
            try {
                // first we're going to try and clean up the image file that was uploaded to the server.
                await fs.delete(path.resolve(__dirname, this.uploadDirectoryRootLocation, `${CONST.IMAGE_UPLOAD_PATH}${rawImageFile.filename}`));
            } catch (err) {
                log.error(`SWALLOWING! There was an error trying to delete the file that was created during upload.
            Upload path could fill. filename: ${rawImageFile.filename}  Exception: ${err}`);
            }

            imageStyles.forEach(imageStyle => {
                try {
                    this.rollbackVariations(rawImageFile, imageStyle.imageType, cleanS3);
                } catch (err) {
                    log.error(`SWALLOWING!  There was an error trying to cleanup the files from the server, and S3.
                Upload path could fill. filename: ${rawImageFile.filename}  Exception: ${err}`);
                }
            });

        }

        public static async rollbackVariations(rawImageFile: MulterFile, imageType: enums.ImageType, cleanS3: boolean): Promise<void> {
            try {
                // now we're going to try and clean up all the variations that were created.
                await fs.delete(path.resolve(__dirname, this.uploadDirectoryRootLocation, `${CONST.IMAGE_UPLOAD_PATH}${AmazonS3Service.variationName(imageType, rawImageFile)}`));
            } catch (err) {
                log.error(`SWALLOWING! While trying to cleanup image variations there was an error. filename: ${AmazonS3Service.variationName(imageType, rawImageFile)}
             Exception: ${err}`);
            }

            try {
                if (cleanS3) {
                    AmazonS3Service.cleanAws(rawImageFile, imageType);
                }
            } catch (err) {
                log.error(`SWALLOWING! Exception while trying to clean the image from S3 KEY: ${AmazonS3Service.variationName(imageType, rawImageFile)}
            Exception: ${err}`);
            }
        }

        public async deleteImage(request: Request, response: Response, next: NextFunction, controller: BaseController): Promise<IBaseModelDoc> {
            try {
                const itemId = await controller.getId(request);
                const imageId = request && request.params ? request.params['imageId'] : null;
                const itemDoc = await controller.repository.single(itemId);
                const itemWithImages = itemDoc as IHasImages;

                //now we need to get the product image this request is referring to.
                const imageIndex = itemWithImages.images.findIndex((image) => {
                    return image._id == imageId;
                });

                if (imageIndex >= 0) {

                    itemWithImages.images[imageIndex].variations.forEach(async (variation) => {
                        await AmazonS3Service.deleteFileFromS3(variation.key);
                    });

                    itemWithImages.images.splice(imageIndex, 1);

                    await controller.repository.save(itemDoc);

                    response.status(200).json(itemWithImages.images);

                    return itemDoc;
                } else {
                    throw { message: "Image not found.", status: 404 };
                }

            } catch (err) { next(err); }
        }

        public static async destroyImages(itemDoc: IBaseModelDoc): Promise<IBaseModelDoc> {
            // First we go out and get the model from the database
            const itemWithImages = itemDoc as IHasImages;

            if (!itemDoc) { throw { message: "Item Not Found, In Destroy Image Hook", status: 404 }; }

            // These really wordy for loops are needed, because those mongoose arrays don't always behave with a foreach.
            // We're only going to delete the product images if this is a product template.
            if (itemWithImages && itemWithImages.images) {
                for (var i = 0; i < itemWithImages.images.length; i++) {
                    var image = itemWithImages.images[i];
                    if (image.variations && image.variations.length > 0) {
                        for (var j = 0; j < image.variations.length; j++) {
                            var variation = image.variations[j];
                            await AmazonS3Service.deleteFileFromS3(variation.key);
                        }
                    }
                }
            }
            return itemDoc
        }
    }
}
