import { Router } from 'express';
import { BucketItemController } from '../controllers/';
import { Request, Response, RequestHandler, } from 'express';
import { RequestHandlerParams, NextFunction } from 'express-serve-static-core';
import { BaseRouter } from './base/base.router';
import { CONST } from '../constants';
import { AuthenticationController } from '../controllers/authentication.controller';
import * as passport from 'passport';
import * as InstagramStrategy from 'passport-instagram';
import * as FacebookStrategy from 'passport-facebook';
import * as FacebookTokenStrategy from 'passport-facebook-token';
import { Config } from '../config/config';
import { IUser } from '../models';
import { LoginStrategy } from '../enumerations';

export class AuthenticationRouter extends BaseRouter {

    public router: Router = Router();
    public controller = new AuthenticationController();
    public resource: string = CONST.ep.AUTHENTICATE;

    public constructor() {
        super();

        this.initializeInstagramStrategy();
        this.initializeFacebookStrategy();
        this.initializeFacebookTokenStrategy();
    }

    public initializeInstagramStrategy() {
        passport.use(new InstagramStrategy({
            clientID: Config.active.get('instagramClientId'),
            clientSecret: Config.active.get('instagramClientSecret'),
            callbackURL: `${Config.active.get('APILocation')}${CONST.ep.API}${CONST.ep.V1}${this.resource}${CONST.ep.INSTAGRAM}${CONST.ep.CALLBACK}`
        },
            (accessToken, refreshToken, profile, done) => {
                // here what will come in is a profile.id
                // we need to have a controller method that will take the profile and do something with it. 
                this.controller.upsertSocialAuth(accessToken, refreshToken, profile, done, LoginStrategy.Instagram, { instagramAuth: { id: profile.id } }, (profile) => {
                    const user: IUser = { instagramAuth: { id: profile.id } }
                    // most others will need to set the email here off the profile id.
                    return user;
                })
            }
        ));
    }

    public initializeFacebookTokenStrategy(): any {
        passport.use(new FacebookTokenStrategy({
            clientID: Config.active.get('facebookClientId'),
            clientSecret: Config.active.get('facebookClientSecret'),
            profileFields: ['id', 'displayName', 'email',] //notice here I'm telling passport what fields I want back from facebook.
        },
            (accessToken, refreshToken, profile, done) => {
                // here what will come in is a profile.id
                // we need to have a controller method that will take the profile and do something with it. 
                this.HandleFacebookStyleUpsert(accessToken,refreshToken,profile,done);
            }
        ));
    }

    public initializeFacebookStrategy() {
        passport.use(new FacebookStrategy.Strategy({
            clientID: Config.active.get('facebookClientId'),
            clientSecret: Config.active.get('facebookClientSecret'),
            callbackURL: `${Config.active.get('APILocation')}${CONST.ep.API}${CONST.ep.V1}${this.resource}${CONST.ep.FACEBOOK}${CONST.ep.CALLBACK}`,
            profileFields: ['id', 'displayName', 'email'] //notice here I'm telling passport what fields I want back from facebook.
        },
            (accessToken, refreshToken, profile, done) => {
                // here what will come in is a profile.id
                // we need to have a controller method that will take the profile and do something with it. 
                this.HandleFacebookStyleUpsert(accessToken,refreshToken,profile,done);
            }
        ));
    }

    private HandleFacebookStyleUpsert(accessToken, refreshToken, profile, done){
        this.controller.upsertSocialAuth(accessToken, refreshToken, profile, done, LoginStrategy.Facebook, { facebookAuth: { id: profile.id } }, (profile) => {
            const user: IUser = { facebookAuth: { id: profile.id } }
            if(profile.emails.length > 0){
                user.email = profile.emails[0].value;
                user.isEmailVerified = true;
            }
            // most others will need to set the email here off the profile id.
            return user;
        });
    }

    public getRestrictedRouter(): Router {
        return this.router
            // All the routes for instagram authentication.
            // to test these routes hit this URL => http://localhost:9000/api/v1/authenticate/facebook
            // that should auth through instagram, and come back to the callback. 
            //'facebook-token'
            .post(`${this.resource}${CONST.ep.FACEBOOK}${CONST.ep.CB}`, passport.authenticate('facebook', { scope: ['email'], session: false }))
            .get(`${this.resource}${CONST.ep.FACEBOOK}${CONST.ep.CB}${CONST.ep.CALLBACK}`,  // this uses the facebook strategy for auth.
                async (request: Request, response: Response, next: NextFunction) => {
                    // Successful authentication, redirect home.
                    await this.controller.sendTokenResponse(request, response, next);
                })
            
            //'facebook-token' - There's no callback with this strategy.  It's basically just sending up a short time token
            // and then we send down a long term token.
            .post(`${this.resource}${CONST.ep.FACEBOOK}`, passport.authenticate('facebook-token', { scope: ['email'], session: false }),
            async (request: Request, response: Response, next: NextFunction) => {
                // Successful authentication, redirect home.
                await this.controller.sendTokenResponse(request, response, next);
            })

            // All the routes for instagram authentication.
            // to test these routes hit this URL => http://localhost:9000/api/v1/authenticate/instagram/
            // that should auth through instagram, and come back to the callback. 
            .post(`${this.resource}${CONST.ep.INSTAGRAM}`, passport.authenticate('instagram'))
            .get(`${this.resource}${CONST.ep.INSTAGRAM}${CONST.ep.CALLBACK}`, // this gets hit in the callback.
                passport.authenticate('instagram', { failureRedirect: '/', session: false }), // this uses the instagram strategy for auth.
                async (request: Request, response: Response, next: NextFunction) => {
                    // Successful authentication, redirect home.
                    await this.controller.sendTokenResponse(request, response, next);
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