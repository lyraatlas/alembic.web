import { Database } from '../config/database/database';
import { App, server } from '../server-entry';
import { Config } from '../config/config';
import { CONST } from "../constants";

import * as moment from 'moment';
import * as supertest from 'supertest';
import * as chai from 'chai';
import log = require('winston');
import { IdentityApiService } from "../services/identity.api.service";
import { IUser } from '../models/user.interface';
import { ITokenPayload } from '../models';

const api = supertest.agent(App.server);
const identityApi = null // supertest(Config.active.get('identityApiEndpoint'));

const mongoose = require("mongoose");
const expect = chai.expect;
const should = chai.should();

// We need to rename this so it doesn't collide with the authentication utility in the controllers folder.
export class AuthUtil {

    static userToken: string = '';
    static decodedToken: ITokenPayload;

    static userToken2: string = '';
    static decodedToken2: ITokenPayload;

    public static async Initialize(): Promise<string> {
        if(this.userToken == ''){
            try {
                await this.registerUser('testUser@lyraatlas.com');
    
                // Now we've registered this user.  Let's authenticate them.
                let auth = {
                    "email": "testUser@lyraatlas.com",
                    "password": "test1234"
                }
    
                let authResponse = await api
                    .post(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.AUTHENTICATE}${CONST.ep.LOCAL}${CONST.ep.LOGIN}`)
                    .send(auth);
    
                expect(authResponse.status).to.equal(200);
                expect(authResponse.body.token).length.to.be.greaterThan(0);
    
                this.userToken = authResponse.body.token;
                this.decodedToken = authResponse.body.decoded;

                let userId2 = await this.registerUser('at@la.com');
                let auth2 = {
                    "email": "at@la.com",
                    "password": "test1234"
                }

                let authResponse2 = await api
                .post(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.AUTHENTICATE}${CONST.ep.LOCAL}${CONST.ep.LOGIN}`)
                .send(auth2);
    
                this.userToken2 = authResponse2.body.token;
                this.decodedToken2 = authResponse2.body.decoded;

                return this.userToken;
            } catch (err) {
                this.handleTestError(err);
            }
        }
    }

    public static async registerUser(email: string): Promise<string> {
        // We need to create a test user account.
        let user: IUser = {
            email: email,
            password: 'test1234',
            isActive: true,
            roles: [CONST.USER_ROLE],
            isEmailVerified: true,
            firstName: "Dave",
            lastName: "Brown",
            isTokenExpired: false
        }

        let registerResponse = await api
            .post(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.AUTHENTICATE}${CONST.ep.LOCAL}${CONST.ep.REGISTER}`)
            .send(user);

        expect(registerResponse.status).to.equal(201);
        expect(registerResponse.body).to.be.an('object');
        expect(registerResponse.body.password).to.be.equal('');
        expect(registerResponse.body._id).length.to.be.greaterThan(0);

        return registerResponse.body._id;
    }

    private static handleTestError(err: any): void {
        log.error('There was an error during the authentication utitlity setup');
        log.error(err)
        throw err;
    }
}