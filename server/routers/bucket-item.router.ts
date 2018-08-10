import { Request, Response, Router } from 'express';
import { NextFunction } from 'express-serve-static-core';
import { CONST } from '../constants';
import { BucketItemController } from '../controllers/';
import * as enums from '../enumerations';
import { NotificationType } from '../enumerations';
import { BaseRouter } from './base/base.router';

export class BucketItemRouter extends BaseRouter {
    public router: Router = Router();
    public controller = new BucketItemController();
    public resource: string;

    public imageStyles = [{
        imageType: enums.ImageType.thumbnail, height: 150, width: 150,
    },
    {
        imageType: enums.ImageType.medium, height: 500,
    },
    {
        imageType: enums.ImageType.large, height: 1024,
    }];

    public constructor() {
        super();
        this.resource = CONST.ep.BUCKET_ITEMS;
    }

    public async ImageHandler(request: Request, response: Response, next: NextFunction) {
        // For some reason this.controller is not defined at this stage in the pipeline.
        await BucketItemController.imageTransformer(request, response, next, this.controller, this.imageStyles);
    }

    public getRouter(): Router {

        return super.getRouter()
            // Removes a single resource by id
            .delete(`${this.resource}${CONST.ep.REMOVE_REFERENCES}/:id`, async (request: Request, response: Response, next: NextFunction) => {
                await this.controller.deleteFromBucket(request, response, next);
            })
            .patch(`${this.resource}${CONST.ep.LIKES}/:id`, async (request: Request, response: Response, next: NextFunction) => {
                await BucketItemController.addLike(request, response, next, this.controller, NotificationType.BucketItemLiked);
            })
            .delete(`${this.resource}${CONST.ep.LIKES}/:id`, async (request: Request, response: Response, next: NextFunction) => {
                await BucketItemController.removeLike(request, response, next, this.controller);
            })
            .post(`${this.resource}${CONST.ep.COMMENTS}/:id`, async (request: Request, response: Response, next: NextFunction) => {
                await BucketItemController.addComment(request, response, next, this.controller, NotificationType.BucketItemCommentAdded);
            })
            .delete(`${this.resource}${CONST.ep.COMMENTS}/:id`, async (request: Request, response: Response, next: NextFunction) => {
                await BucketItemController.removeComment(request, response, next, this.controller);
            })
            .patch(`${this.resource}${CONST.ep.COMMENTS}/:id`, async (request: Request, response: Response, next: NextFunction) => {
                await BucketItemController.editComment(request, response, next, this.controller);
            })
            .delete(`${this.resource}${CONST.ep.IMAGES}/:id/:imageId`, async (request: Request, response: Response, next: NextFunction) => {
                await this.controller.deleteImage(request, response, next, this.controller);
            });
    }
}