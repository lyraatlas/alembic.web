import { Router } from 'express';
import { BucketController } from '../controllers/';
import { Request, Response, RequestHandler, } from 'express';
import { RequestHandlerParams, NextFunction } from 'express-serve-static-core';
import { BaseRouter } from './base/base.router';
import { CONST } from '../constants';
import { NotificationType } from '../enumerations';

export class BucketRouter extends BaseRouter {
    public router: Router = Router();
    public controller = new BucketController();
    public resource: string;

    public constructor(){
        super();
        this.resource = CONST.ep.BUCKETS;
    }

    public async ImageHandler(request: Request, response: Response, next: NextFunction) {
        // For some reason this.controller is not defined at this stage in the pipeline.
        await BucketController.imageTransformer(request,response,next,new BucketController());
    }

    public getRouter(): Router{
        return super.getRouter()
        .patch(`${this.resource}${CONST.ep.LIKES}/:id`, async (request: Request, response: Response, next: NextFunction) => {
            await BucketController.addLike(request,response,next,this.controller, NotificationType.BucketLiked);
        })
        .delete(`${this.resource}${CONST.ep.LIKES}/:id`, async (request: Request, response: Response, next: NextFunction) => {
            await BucketController.removeLike(request,response,next,this.controller);
        })
        .post(`${this.resource}${CONST.ep.COMMENTS}/:id`, async (request: Request, response: Response, next: NextFunction) => {
            await BucketController.addComment(request,response,next,this.controller, NotificationType.BucketCommentAded);
        })
        .delete(`${this.resource}${CONST.ep.COMMENTS}/:id`, async (request: Request, response: Response, next: NextFunction) => {
            await BucketController.removeComment(request,response,next,this.controller);
        })
        .patch(`${this.resource}${CONST.ep.COMMENTS}/:id`, async (request: Request, response: Response, next: NextFunction) => {
            await BucketController.editComment(request,response,next,this.controller);
        })
        .delete(`${this.resource}${CONST.ep.IMAGES}/:id/:imageId`, async (request: Request, response: Response, next: NextFunction) => {
            await this.controller.deleteImage(request, response, next, this.controller);
        });
    }
}