import { Router } from 'express';
import { BucketItemController } from '../controllers/';
import { Request, Response, RequestHandler, } from 'express';
import { RequestHandlerParams, NextFunction } from 'express-serve-static-core';
import { BaseRouter } from './base/base.router';
import { CONST } from '../constants';
import { AuthenticationController } from '../controllers/authentication.controller';
import * as passport from 'passport';
import * as InstagramStrategy from 'passport-instagram';
import { Config } from '../config/config';

export class AuthenticationRouter extends BaseRouter {
    public router: Router = Router();
    public controller = new AuthenticationController();
    public resource: string;

    public constructor(){
        super();
        this.resource = CONST.ep.AUTHENTICATE;
    }

    public getRestrictedRouter(): Router {
        passport.use(new InstagramStrategy({
            clientID: Config.active.get('instagramClientId'),
            clientSecret: Config.active.get('instagramClientSecret'),
            callbackURL: `http://localhost:9000${CONST.ep.API}${CONST.ep.V1}${this.resource}${CONST.ep.INSTAGRAM}${CONST.ep.CALLBACK}`
          },
          (accessToken, refreshToken, profile, done) => {
              // here what will come in is a profile.id
              // we need to have a controller method that will take the profile and do something with it. 
              this.controller.FindOrCreateInstagram(accessToken,refreshToken, profile, done)
          }
        ));

        return this.router

            // All the routes for instagram authentication.
            .get(`${this.resource}${CONST.ep.INSTAGRAM}`,passport.authenticate('instagram'))
            .get(`${this.resource}${CONST.ep.INSTAGRAM}${CONST.ep.CALLBACK}`, 
                passport.authenticate('instagram', { failureRedirect: '/', session:false }),
                    function(req, res) {
                        // Successful authentication, redirect home.
                        res.send('We authenticated the instagram');
                    })

            // This is for the local login schemes.
            .post(`${this.resource}${CONST.ep.LOCAL}${CONST.ep.LOGIN}`, 
                async (request: Request, response: Response, next: NextFunction) => {
                await this.controller.authenticateLocal(request, response, next);
            })
            // This is for registering a new user with a local scheme.
            .post(`${this.resource}${CONST.ep.LOCAL}${CONST.ep.REGISTER}`, async (request: Request, response: Response, next: NextFunction) => {
                await this.controller.register(request, response, next);
            });
    }
}