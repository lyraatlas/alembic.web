import * as chai from 'chai';
import { suite, test } from "mocha-typescript";
import * as supertest from 'supertest';
import { CONST } from "../../constants";
import { IUser } from '../../models';
import { App } from '../../server-entry';
import { Cleanup } from "../cleanup.util.spec";


const api = supertest.agent(App.server);
const mongoose = require("mongoose");
const expect = chai.expect;
const should = chai.should();

@suite('Authentication Tester -> ')
class AuthenticationTest {

    // First we need to get some users to work with from the identity service
    public static before(done) {
        console.log('Testing Authentication');
        // This code should only be called if this test is run as a single test.  When run in the suite along with
        // bootstrap.util.spec this code is run by the bootstrap spec.
        // App.server.on('dbConnected', async () => {
        //     await Cleanup.clearDatabase();
        //     await DatabaseBootstrap.seed();

        //     // This will create, 2 users, an organization, and add the users to the correct roles.
        //     await AuthUtil.createIdentityApiTestData();
        //     done();
        // });
        //This done should be commented if you're going to run this as suite.only()
        done();
    }

    public static async after() {
        await Cleanup.clearDatabase(false);
    }

    @test('Just setting up a test for testing initialization')
    public async initialize() {
        expect(1).to.be.equal(1);
        return;
    }

    @test('allow a user to register')
    public async register() {
        let user: IUser = {
            email: 'asdfaou0987@lyra.com',
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
        return;
    }

    @test('allow a user to authenticate locally')
    public async authLocal() {
        let creds = {
            email: 'asdfaou0987@lyra.com',
            password: 'test1234',
        }

        let authResponse = await api
            .post(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.AUTHENTICATE}${CONST.ep.LOCAL}${CONST.ep.LOGIN}`)
            .send(creds);

        expect(authResponse.status).to.equal(200);
        expect(authResponse.body).to.be.an('object');
        expect(authResponse.body.token).length.to.be.greaterThan(0);
        return;
    }

    @test('should fail if a user puts in the wrong password.')
    public async wrongPasswordFail() {
        let creds = {
            email: 'asdfaou0987@lyra.com',
            password: 'asdfasdfasdf',
        }

        let authResponse = await api
            .post(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.AUTHENTICATE}${CONST.ep.LOCAL}${CONST.ep.LOGIN}`)
            .send(creds);
        
        expect(authResponse.status).to.equal(401);
        expect(authResponse.body).to.be.an('object');
        return;
    }
}
