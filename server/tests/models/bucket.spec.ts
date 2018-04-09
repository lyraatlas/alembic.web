import { Database } from '../../config/database/database';
import { App, server } from '../../server-entry';
import { Bucket, IBucket, ITokenPayload, ICommentable } from '../../models';
import { Config } from '../../config/config';
import { CONST } from "../../constants";
import { AuthUtil } from "../authentication.util";
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

    @test('creating new buckets should work')
    public async TestAbilityToCreateBucket() {
        let bucket: IBucket = {
            name: "Russia Is Amazing",
        }

        let response = await api
            .post(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKETS}`)
            .set(CONST.TOKEN_HEADER_KEY, AuthUtil.userToken)
            .send(bucket);

        expect(response.status).to.equal(201);
        expect(response.body.name).to.be.equal(bucket.name);
        expect(response.body.owners[0].ownerId).to.be.equal(AuthUtil.decodedToken.userId);
        return;
    }

    @test('should list all the buckets')
    public async bucketList() {
        let response = await api
            .get(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep. BUCKETS}`)
            .set("x-access-token", AuthUtil.userToken);

        expect(response.status).to.equal(200);
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
        expect(response.body.name).to.equal(bucketUpdate.name);
        return;
    }

    @test('it should fail to update the bucket when tried by the user who doesnt own it')
    public async updateABucketFailsWithAnotherUser() {
        let createdId = await this.createBucket(AuthUtil.userToken);

        let bucketUpdate = {
            _id: `${createdId}`,
            name: "Daves Tulip",
        };

        let response = await api
            .put(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKETS}/${createdId}`)
            .set("x-access-token", AuthUtil.userToken2)
            .send(bucketUpdate);

        // The server will respond with a 403 when the ownership check fails.    
        expect(response.status).to.equal(403);
        return;
    }

    @test('regular users cant call clear on the resource')
    public async regularUsersCantCallClear() {
        let createdId = await this.createBucket(AuthUtil.userToken);

        let response = await api
            .delete(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKETS}/clear`)
            .set("x-access-token", AuthUtil.userToken)
            .send({});

        // The server will respond with a 403 when the ownership check fails.    
        expect(response.status).to.equal(403);
        return;
    }

    @test('it should add a like to a bucket, and lodge a notification')
    public async AddALikeToABucket() {
        let createdId = await this.createBucket(AuthUtil.userToken);

        let bucketUpdate = {};

        let response = await api
            .patch(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKETS}${CONST.ep.LIKES}/${createdId}`)
            .set("x-access-token", AuthUtil.userToken)
            .send(bucketUpdate);

        expect(response.status).to.equal(202);
        expect(response.body.likedBy.length).to.equal(1);
        expect(response.body.likedBy[0]).to.equal(AuthUtil.decodedToken.userId);

        // now we're checking the notifications.
        let response2 = await api
        .get(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.NOTIFICATIONS}`)
        .set("x-access-token", AuthUtil.userToken);

        expect(response2.status).to.equal(200);
        expect(response2.body[0].bucket).to.equal(createdId);
        expect(response2.body[0].isRead).to.equal(false);
        return;
    }

    @test('it should only add the like once')
    public async AddLikeOnce() {
        let createdId = await this.createBucket(AuthUtil.userToken);

        let bucketUpdate = {};

        let response2 = await api
            .patch(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKETS}${CONST.ep.LIKES}/${createdId}`)
            .set("x-access-token", AuthUtil.userToken)
            .send(bucketUpdate);

        let response = await api
            .patch(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKETS}${CONST.ep.LIKES}/${createdId}`)
            .set("x-access-token", AuthUtil.userToken)
            .send(bucketUpdate);

        expect(response.status).to.equal(202);
        expect(response.body.likedBy.length).to.equal(1);
        expect(response.body.likedBy[0]).to.equal(AuthUtil.decodedToken.userId);
        return;
    }

    @test('it should only add a comment to the item')
    public async AddComment() {
        let createdId = await this.createBucket(AuthUtil.userToken);

        const testComment = "This is a test comment";

        let addComment = {
            comment: testComment,
        };

        let response = await api
            .post(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKETS}${CONST.ep.COMMENTS}/${createdId}`)
            .set("x-access-token", AuthUtil.userToken)
            .send(addComment);

        console.dir(response.body.comments);

        expect(response.status).to.equal(202);
        expect(response.body.comments.length).to.equal(1);
        expect(response.body.comments[0].comment).to.equal(testComment);
        return;
    }

    @test('it should only edit a comment to the item')
    public async EditComment() {
        let createdId = await this.createBucket(AuthUtil.userToken);

        const testComment = "This is a test comment";

        let addComment = {
            comment: testComment,
        };

        let responseAdd = await api
            .post(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKETS}${CONST.ep.COMMENTS}/${createdId}`)
            .set("x-access-token", AuthUtil.userToken)
            .send(addComment);
        
        const createdCommentId = (responseAdd.body as ICommentable).comments[0]._id;

        const editedText = "Updated Text";

        let editComment = {
            comment: editedText,
            _id: createdCommentId,
        };

        let response = await api
            .patch(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKETS}${CONST.ep.COMMENTS}/${createdId}`)
            .set("x-access-token", AuthUtil.userToken)
            .send(editComment);

        console.dir(response.body.comments);

        expect(response.status).to.equal(200);
        expect(response.body.comments.length).to.equal(1);
        expect(response.body.comments[0].comment).to.equal(editedText);
        return;
    }

    @test('it should only delete the comment from the item')
    public async RemoveComment() {
        let createdId = await this.createBucket(AuthUtil.userToken);

        const testComment = "This is a test comment";

        let addComment = {
            comment: testComment,
        };

        let responseAdd = await api
            .post(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKETS}${CONST.ep.COMMENTS}/${createdId}`)
            .set("x-access-token", AuthUtil.userToken)
            .send(addComment);

        const createdCommentId = (responseAdd.body as ICommentable).comments[0]._id;

        let removeRequest = {
            _id: createdCommentId
        }

        let response = await api
        .delete(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKETS}${CONST.ep.COMMENTS}/${createdId}`)
        .set("x-access-token", AuthUtil.userToken)
        .send(removeRequest);

        expect(response.status).to.equal(200);
        expect(response.body.comments.length).to.equal(0);
        return;
    }

    @test('it should remove a like from a bucket')
    public async RemoveALikeFromABucket() {
        let createdId = await this.createBucket(AuthUtil.userToken);

        let bucketUpdate = {};

        let response1 = await api
            .patch(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKETS}${CONST.ep.LIKES}/${createdId}`)
            .set("x-access-token", AuthUtil.userToken)
            .send(bucketUpdate);

        let response = await api
            .delete(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKETS}${CONST.ep.LIKES}/${createdId}`)
            .set("x-access-token", AuthUtil.userToken)
            .send(bucketUpdate);

        //console.dir(response.body);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('likedBy');
        expect(response.body.likedBy.length).to.equal(0);
        return;
    }

    @test('it should delete a bucket')
    public async deleteABucket() {
        let createdId = await this.createBucket(AuthUtil.userToken);

        let response = await api
            .delete(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKETS}/${createdId}`)
            .set("x-access-token", AuthUtil.userToken);

        expect(response.status).to.equal(200);
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

    @test('create a bucket, add images, delete should delete images')
    public async deletingShouldAlsoDeleteTheImages() {
        let createdId = await this.createBucket(AuthUtil.userToken);

        // Now we need to post a test image. 
        // './assets/testImage.jpg'
        let uploadResponse =  await api.post(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKETS}${CONST.ep.IMAGES}/${createdId}`)
        .set("x-access-token", AuthUtil.userToken)
        .attach('file', './server/tests/assets/testImage.jpg');

        expect(uploadResponse.status).to.equal(200);

        // Now I want to check the response with regards to the images on the item.
        let singleResponse = await api
        .get(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKETS}/${createdId}`)
        .set("x-access-token", AuthUtil.userToken);

        expect((singleResponse.body as IBucket).images.length).to.be.greaterThan(0);
        expect((singleResponse.body as IBucket).images[0].isActive).to.be.true;
        expect((singleResponse.body as IBucket).images[0].variations.length).to.be.greaterThan(0);

        let response = await api
            .delete(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKETS}/${createdId}`)
            .set("x-access-token", AuthUtil.userToken);

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('ItemRemoved');
        expect(response.body).to.have.property('ItemRemovedId');
        expect(response.body.ItemRemovedId).to.be.equal(createdId);
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
