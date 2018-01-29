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
        this.resource = '';
    }

    public getRestrictedRouter(): Router {
        return this.router
            // Get Single Operation
            .post(`${CONST.ep.LOGIN}`, 
            passport.authenticate(
                'local', 
                { 
                    successRedirect: '/home', // should be something like /home
                    failureRedirect: '/api/v1/buckets', // should be something like /login
                    failureFlash: false,
                    session: false,
                }),
                async (request: Request, response: Response, next: NextFunction) => {
                await this.controller.login(request, response, next);
            });
    }
}