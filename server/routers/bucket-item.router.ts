import { Router } from 'express';
import { BucketItemController } from '../controllers/';
import { Request, Response, RequestHandler, } from 'express';
import { RequestHandlerParams, NextFunction } from 'express-serve-static-core';
import { BaseRouter } from './base/base.router';
import { CONST } from '../constants';

export class BucketItemRouter extends BaseRouter {
    public router: Router = Router();
    public controller = new BucketItemController();
    public resource: string;

    public constructor(){
        super();
        this.resource = CONST.ep.BUCKET_ITEMS;
    }

    public getRouter(): Router{
        return super.getRouter()
        .patch(`${this.resource}${CONST.ep.LIKES}/:id`, async (request: Request, response: Response, next: NextFunction) => {
            await BucketItemController.addLike(request,response,next,this.controller);
        })
        .delete(`${this.resource}${CONST.ep.LIKES}/:id`, async (request: Request, response: Response, next: NextFunction) => {
            await BucketItemController.removeLike(request,response,next,this.controller);
        })
        .post(`${this.resource}${CONST.ep.COMMENTS}/:id`, async (request: Request, response: Response, next: NextFunction) => {
            await BucketItemController.addComment(request,response,next,this.controller);
        })
        .delete(`${this.resource}${CONST.ep.COMMENTS}/:id`, async (request: Request, response: Response, next: NextFunction) => {
            await BucketItemController.removeComment(request,response,next,this.controller);
        })
        .patch(`${this.resource}${CONST.ep.COMMENTS}/:id`, async (request: Request, response: Response, next: NextFunction) => {
            await BucketItemController.editComment(request,response,next,this.controller);
        })
    }
}