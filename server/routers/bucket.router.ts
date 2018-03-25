import { Router } from 'express';
import { BucketController } from '../controllers/';
import { Request, Response, RequestHandler, } from 'express';
import { RequestHandlerParams, NextFunction } from 'express-serve-static-core';
import { BaseRouter } from './base/base.router';
import { CONST } from '../constants';

export class BucketRouter extends BaseRouter {
    public router: Router = Router();
    public controller = new BucketController();
    public resource: string;

    public constructor(){
        super();
        this.resource = CONST.ep.BUCKETS;
    }

    public getRouter(): Router{
        return super.getRouter()
        .patch(`${this.resource}${CONST.ep.LIKES}/:id`, async (request: Request, response: Response, next: NextFunction) => {
            await BucketController.addLike(request,response,next,this.controller);
        })
        .delete(`${this.resource}${CONST.ep.LIKES}/:id`, async (request: Request, response: Response, next: NextFunction) => {
            await BucketController.removeLike(request,response,next,this.controller);
        })
        .post(`${this.resource}${CONST.ep.COMMENTS}/:id`, async (request: Request, response: Response, next: NextFunction) => {
            await BucketController.addComment(request,response,next,this.controller);
        })
        .delete(`${this.resource}${CONST.ep.COMMENTS}/:id`, async (request: Request, response: Response, next: NextFunction) => {
            await BucketController.removeComment(request,response,next,this.controller);
        })
        .patch(`${this.resource}${CONST.ep.COMMENTS}/:id`, async (request: Request, response: Response, next: NextFunction) => {
            await BucketController.editComment(request,response,next,this.controller);
        })
    }
}