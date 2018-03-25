import { Database } from '../../config/database/database';
import { App, server } from '../../server-entry';
import { Bucket, IBucket, ITokenPayload } from '../../models';
import { Config } from '../../config/config';
import { CONST } from "../../constants";
import { AuthUtil } from "../authentication.util.spec";
import { Cleanup } from "../cleanup.util.spec";
import { suite, test } from "mocha-typescript";
import { DatabaseBootstrap } from "../../config/database/database-bootstrap";

import * as supertest from 'supertest';
import * as chai from 'chai';

const api = supertest.agent(App.server);
const mongoose = require("mongoose");
const expect = chai.expect;
const should = chai.should();

@suite('Bucket Model -> ')
class BucketTest {

    // First we need to get some users to work with from the identity service
    public static before(done) {
        console.log('Testing buckets');
        // This code should only be called if this test is run as a single test.  When run in the suite along with
        // product this code is run by the product test.
        // App.server.on('dbConnected', async () => {
        //     console.log('Got the dbConnected Signal, so now we can clear, and seed the database.' )
        //     await Cleanup.clearDatabase();
        //     console.log('About to seed the database');
        //     await DatabaseBootstrap.seed();

        //     console.log('About to create identity test data.');
        //     // This will create, 2 users, an organization, and add the users to the correct roles.
        //     await AuthUtil.registerUser("dave2");
        //     await AuthUtil.Initialize();
            
        //     done();
        // });

        done();
    }

    public static async after() {
        await Cleanup.clearDatabase();
    }

    @test('Just setting up a test for testing initialization')
    public async initialize() {
        await AuthUtil.Initialize();
        expect(1).to.be.equal(1);
        return;
    }

    @test('system admins should be allowed to create new buckets')
    public async TestAbilityToCreateBucket() {
        let bucket: IBucket = {
            name: "Midnight Snap Dragon Admin",
        }

        let response = await api
            .post(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKETS}`)
            .set(CONST.TOKEN_HEADER_KEY, AuthUtil.userToken)
            .send(bucket);

        expect(response.status).to.equal(201);
        expect(response.body).to.be.an('object');
        expect(response.body.name).to.be.equal(bucket.name);
        // expect(response.body.ownerships).to.be.an('array');
        // expect(response.body.ownerships.length).to.be.greaterThan(0);
        return;
    }

    @test('should list all the buckets')
    public async bucketList() {
        let response = await api
            .get(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep. BUCKETS}`)
            .set("x-access-token", AuthUtil.userToken);

        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.greaterThan(0); // List of all the buckets.
        return;
    }

    @test('making sure get bucket by id works')
    public async getByIdWorking() {
        let createdId = await this.createBucket(AuthUtil.userToken);

        let response = await api
            .get(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKETS}/${createdId}`)
            .set("x-access-token", AuthUtil.userToken);

        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('name');
        return;
    }

    @test('it should update a bucket')
    public async updateABucket() {
        let createdId = await this.createBucket(AuthUtil.userToken);

        let bucketUpdate = {
            _id: `${createdId}`,
            name: "Daves Tulip",
        };

        let response = await api
            .put(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKETS}/${createdId}`)
            .set("x-access-token", AuthUtil.userToken)
            .send(bucketUpdate);

        expect(response.status).to.equal(202);
        expect(response.body).to.have.property('name');
        expect(response.body.name).to.equal(bucketUpdate.name);
        return;
    }

    @test('it should delete a bucket')
    public async deleteABucket() {
        let createdId = await this.createBucket(AuthUtil.userToken);

        let response = await api
            .delete(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKETS}/${createdId}`)
            .set("x-access-token", AuthUtil.userToken);

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('ItemRemoved');
        expect(response.body).to.have.property('ItemRemovedId');
        expect(response.body.ItemRemovedId).to.be.equal(createdId);
        return;
    }


    @test('should return a 404 on delete when the ID isnt there')
    public async onDeleteWithoutID404() {
        let response = await api
            .delete(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKETS}/58f8c8caedf7292be80a90e4`)
            .set("x-access-token", AuthUtil.userToken);

        expect(response.status).to.equal(404);
        return;
    }

    @test('should return a 404 on update when the ID isnt there')
    public async onUpdateWithoutID404() {
        let response = await api
            .put(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKETS}/58f8c8caedf7292be80a90e4`)
            .set("x-access-token", AuthUtil.userToken);

        expect(response.status).to.equal(404);
        return;
    }


    private async createBucket(authToken: string):Promise<string>{
        let bucket: IBucket = {
            name: "Russia Is Amazing",
        }

        let createResponse = await api
            .post(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKETS}`)
            .set("x-access-token", authToken)
            .send(bucket);

        return createResponse.body._id;
    }
}
