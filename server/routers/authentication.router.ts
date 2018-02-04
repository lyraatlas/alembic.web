import { Router } from 'express';
import { BucketItemController } from '../controllers/';
import { Request, Response, RequestHandler, } from 'express';
import { RequestHandlerParams, NextFunction } from 'express-serve-static-core';
import { BaseRouter } from './base/base.router';
import { CONST } from '../constants';
import { AuthenticationController } from '../controllers/authentication.controller';
import * as passport from 'passport';

export class AuthenticationRouter extends BaseRouter {
    public router: Router = Router();
    public controller = new AuthenticationController();
    public resource: string;

    public constructor(){
        super();
        this.resource = CONST.ep.AUTHENTICATE;
    }

    public getRestrictedRouter(): Router {
        return this.router
            // Get Single Operation
            .post(`${this.resource}${CONST.ep.LOCAL}${CONST.ep.LOGIN}`, 
                async (request: Request, response: Response, next: NextFunction) => {
                await this.controller.authenticateLocal(request, response, next);
            })
            .post(`${this.resource}${CONST.ep.LOCAL}${CONST.ep.REGISTER}`, async (request: Request, response: Response, next: NextFunction) => {
                await this.controller.register(request, response, next);
            })
    }
}