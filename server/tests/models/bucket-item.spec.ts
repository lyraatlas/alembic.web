import * as chai from 'chai';
import { suite, test } from "mocha-typescript";
import * as supertest from 'supertest';
import { CONST } from "../../constants";
import { IBucket, IBucketItem, ICommentable } from '../../models';
import { App } from '../../server-entry';
import { AuthUtil } from "../authentication.util";
import { Cleanup } from "../cleanup.util.spec";


const api = supertest.agent(App.server);
const mongoose = require("mongoose");
const expect = chai.expect;
const should = chai.should();

@suite('BucketItem Item Model -> ')
class BucketItemItemTester {

    // First we need to get some users to work with from the identity service
    public static before(done) {
        console.log('Testing bucketItem items');
        // This code should only be called if this test is run as a single test.  When run in the suite along with
        // product this code is run by the product test.
        // App.server.on('dbConnected', async () => {
        //     console.log('Got the dbConnected Signal, so now we can clear, and seed the database.' )
        //     await Cleanup.clearDatabase();
        //     console.log('About to seed the database');
        //     //await DatabaseBootstrap.seed();

        //     console.log('About to create identity test data.');
        //     // This will create, 2 users, an organization, and add the users to the correct roles.
        //     await AuthUtil.registerUser("dave2");
        //     await AuthUtil.Initialize();

        //     done();
        // });

        done();
    }

    public static async after() {
        await Cleanup.clearDatabase(false);
    }

    @test('Just setting up a test for testing initialization')
    public async initialize() {
        await AuthUtil.Initialize();
        expect(1).to.be.equal(1);
        return;
    }

    @test('creating new bucketItems should work')
    public async TestAbilityToCreateBucketItem() {
        let bucketItem: IBucketItem = {
            name: "Russia Is Amazing",
        }

        let response = await api
            .post(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKET_ITEMS}`)
            .set(CONST.TOKEN_HEADER_KEY, AuthUtil.userToken)
            .send(bucketItem);

        expect(response.status).to.equal(201);
        expect(response.body.name).to.be.equal(bucketItem.name);
        expect(response.body.owners[0].ownerId).to.be.equal(AuthUtil.decodedToken.userId);
        return;
    }

    @test('should list all the bucketItems')
    public async bucketItemList() {
        let response = await api
            .get(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKET_ITEMS}`)
            .set("x-access-token", AuthUtil.userToken);

        expect(response.status).to.equal(200);
        expect(response.body.length).to.be.greaterThan(0); // List of all the bucketItems.
        return;
    }

    @test('making sure get bucketItem by id works')
    public async getByIdWorking() {
        let createdId = await this.createBucketItem(AuthUtil.userToken);

        let response = await api
            .get(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKET_ITEMS}/${createdId}`)
            .set("x-access-token", AuthUtil.userToken);

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('name');
        return;
	}
	
	@test('It should search by query, and should return our result.')
    public async getByQueryShouldWork() {
        let createdId = await this.createBucketItem(AuthUtil.userToken);

        let response = await api
            .post(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKET_ITEMS}/query`)
            .set("x-access-token", AuthUtil.userToken)
            .send(
				{  
					"$text": {
						"$search": "gulag", 
						"$caseSensitive": false 
					} 
				}
			);

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('results');
        expect(response.body.results.length).to.be.greaterThan(0);
        return;
    }

    @test('it should update a bucketItem')
    public async updateABucketItem() {
        let createdId = await this.createBucketItem(AuthUtil.userToken);

        let bucketItemUpdate = {
            _id: `${createdId}`,
            name: "Daves Tulip",
        };

        let response = await api
            .put(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKET_ITEMS}/${createdId}`)
            .set("x-access-token", AuthUtil.userToken)
            .send(bucketItemUpdate);

        expect(response.status).to.equal(202);
        expect(response.body.name).to.equal(bucketItemUpdate.name);
        return;
    }

    @test('it should fail to update the bucketItem when tried by the user who doesnt own it')
    public async updateABucketItemFailsWithAnotherUser() {
        let createdId = await this.createBucketItem(AuthUtil.userToken);

        let bucketItemUpdate = {
            _id: `${createdId}`,
            name: "Daves Tulip",
        };

        let response = await api
            .put(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKET_ITEMS}/${createdId}`)
            .set("x-access-token", AuthUtil.userToken2)
            .send(bucketItemUpdate);

        // The server will respond with a 403 when the ownership check fails.    
        expect(response.status).to.equal(403);
        return;
    }

    @test('regular users cant call clear on the resource')
    public async regularUsersCantCallClear() {
        let createdId = await this.createBucketItem(AuthUtil.userToken);

        let response = await api
            .delete(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKET_ITEMS}/clear`)
            .set("x-access-token", AuthUtil.userToken)
            .send({});

        // The server will respond with a 403 when the ownership check fails.    
        expect(response.status).to.equal(403);
        return;
    }

    @test('it should add a like to a bucketItem, and lodge a notification')
    public async AddALikeToABucketItem() {
        let createdId = await this.createBucketItem(AuthUtil.userToken);

        let bucketItemUpdate = {};

        let response = await api
            .patch(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKET_ITEMS}${CONST.ep.LIKES}/${createdId}`)
            .set("x-access-token", AuthUtil.userToken)
            .send(bucketItemUpdate);

        console.dir(response.body);

        expect(response.status).to.equal(202);
        expect(response.body.likedBy.length).to.equal(1);
        expect(response.body.likedBy[0]).to.equal(AuthUtil.decodedToken.userId);

        // now we're checking the notifications.
        let response2 = await api
            .get(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.NOTIFICATIONS}`)
            .set("x-access-token", AuthUtil.userToken);

        expect(response2.status).to.equal(200);
        expect(response2.body[0].bucketItem).to.equal(createdId);
        expect(response2.body[0].isRead).to.equal(false);
        return;
    }

    @test('it should only add the like once')
    public async AddLikeOnce() {
        let createdId = await this.createBucketItem(AuthUtil.userToken);

        let bucketItemUpdate = {};

        let response2 = await api
            .patch(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKET_ITEMS}${CONST.ep.LIKES}/${createdId}`)
            .set("x-access-token", AuthUtil.userToken)
            .send(bucketItemUpdate);

        let response = await api
            .patch(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKET_ITEMS}${CONST.ep.LIKES}/${createdId}`)
            .set("x-access-token", AuthUtil.userToken)
            .send(bucketItemUpdate);

        expect(response.status).to.equal(202);
        expect(response.body.likedBy.length).to.equal(1);
        expect(response.body.likedBy[0]).to.equal(AuthUtil.decodedToken.userId);
        return;
    }

    @test('it should remove a like from a bucketItem')
    public async RemoveALikeFromABucketItem() {
        let createdId = await this.createBucketItem(AuthUtil.userToken);

        let bucketItemUpdate = {};

        let response1 = await api
            .patch(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKET_ITEMS}${CONST.ep.LIKES}/${createdId}`)
            .set("x-access-token", AuthUtil.userToken)
            .send(bucketItemUpdate);

        let response = await api
            .delete(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKET_ITEMS}${CONST.ep.LIKES}/${createdId}`)
            .set("x-access-token", AuthUtil.userToken)
            .send(bucketItemUpdate);

        //console.dir(response.body);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('likedBy');
        expect(response.body.likedBy.length).to.equal(0);
        return;
    }

    @test('it should delete a bucketItem')
    public async deleteABucketItem() {
        let createdId = await this.createBucketItem(AuthUtil.userToken);

        let response = await api
            .delete(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKET_ITEMS}/${createdId}`)
            .set("x-access-token", AuthUtil.userToken);

        expect(response.status).to.equal(200);
        expect(response.body.ItemRemovedId).to.be.equal(createdId);
        return;
    }

    /*
        Here's the request, and how it's going to be shaped. 
        {
            "bucketId": "123",
            "bucketItemId": "567" 
        }
    */
    @test('it should delete a bucketItem off a bucket')
    public async deleteABucketItemFromBucket() {
        let createdId = await this.createBucketItem(AuthUtil.userToken);

        let createdBucketId = await this.createBucket(AuthUtil.userToken);

        let singleBucketResponse = await api
            .get(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKETS}/${createdBucketId}`)
            .set("x-access-token", AuthUtil.userToken);

        let bucket = singleBucketResponse.body as IBucket;

        (bucket.bucketItems as string[]).push(createdId);

        let updateBucketResponse = await api
            .patch(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKETS}/${createdBucketId}`)
            .set("x-access-token", AuthUtil.userToken)
            .send(bucket);

        let getBackSingle = await api
            .get(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKETS}/${createdBucketId}`)
            .set("x-access-token", AuthUtil.userToken);

        expect(getBackSingle.status).to.equal(200);
        expect(getBackSingle.body.bucketItems.length).to.be.equal(1);

        console.dir(getBackSingle.body);

        let response = await api
            .delete(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKET_ITEMS}${CONST.ep.REMOVE_REFERENCES}/${createdId}`)
            .set("x-access-token", AuthUtil.userToken)
            .send({
                "bucketId": createdBucketId,
                "bucketItemId": createdId
            });

        expect(response.status).to.equal(200);
        expect(response.body.ItemRemovedId).to.be.equal(createdId);

        let singleResponseForBucket = await api
            .get(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKETS}/${createdBucketId}`)
            .set("x-access-token", AuthUtil.userToken);
        //console.dir(singleResponseForBucket.body);

        expect(singleResponseForBucket.status).to.equal(200);
        expect(singleResponseForBucket.body.bucketItems.length).to.be.equal(0);

        return;
    }

    @test('should return a 404 on delete when the ID isnt there')
    public async onDeleteWithoutID404() {
        let response = await api
            .delete(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKET_ITEMS}/58f8c8caedf7292be80a90e4`)
            .set("x-access-token", AuthUtil.userToken);

        expect(response.status).to.equal(404);
        return;
    }

    @test('should return a 404 on update when the ID isnt there')
    public async onUpdateWithoutID404() {
        let response = await api
            .put(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKET_ITEMS}/58f8c8caedf7292be80a90e4`)
            .set("x-access-token", AuthUtil.userToken);

        expect(response.status).to.equal(404);
        return;
    }

    @test('create a bucketItem, add images, delete should delete images')
    public async deletingShouldAlsoDeleteTheImages() {
        let createdId = await this.createBucketItem(AuthUtil.userToken);

        // Now we need to post a test image. 
        // './assets/testImage.jpg'
        let uploadResponse = await api.post(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKET_ITEMS}${CONST.ep.IMAGES}/${createdId}`)
            .set("x-access-token", AuthUtil.userToken)
            .attach('file', './server/tests/assets/testImage.jpg');

        expect(uploadResponse.status).to.equal(200);

        // Now I want to check the response with regards to the images on the item.
        let singleResponse = await api
            .get(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKET_ITEMS}/${createdId}`)
            .set("x-access-token", AuthUtil.userToken);

        expect((singleResponse.body as IBucketItem).images.length).to.be.greaterThan(0);
        expect((singleResponse.body as IBucketItem).images[0].isActive).to.be.true;
        expect((singleResponse.body as IBucketItem).images[0].variations.length).to.be.greaterThan(0);

        let response = await api
            .delete(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKET_ITEMS}/${createdId}`)
            .set("x-access-token", AuthUtil.userToken);

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('ItemRemoved');
        expect(response.body).to.have.property('ItemRemovedId');
        expect(response.body.ItemRemovedId).to.be.equal(createdId);
        return;
    }


    // Testing geo loc searching is working.  this will ensure we have the proper indexes in place.
    @test('geolocation searching working')
    public async addGeoLocationData() {

        let createdId = await this.createBucketItem(AuthUtil.userToken);

        // This should update this product to have a location near hearst tower
        let bucketItemUpdate = {
            _id: `${createdId}`,
            location: {
                coordinates: [
                    -73.9888796,
                    40.7707493
                ],
                type: "Point"
            }
        };

        let response = await api
            .put(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKET_ITEMS}/${createdId}`)
            .set("x-access-token", AuthUtil.userToken)
            .send(bucketItemUpdate);

        expect(response.status).to.equal(202);

        let locationQuery = {
            "location": {
                "$geoWithin": {
                    "$centerSphere": [
                        [
                            -73.98,
                            40.77
                        ],
                        2 / 3963.2 // this is 2 mile radius
                    ]
                }
            }
        }

        // Now we're going to search for products in that location, and we should get this one back.
        let queryResponse = await api
            .post(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKET_ITEMS}${CONST.ep.common.QUERY}`)
            .set("x-access-token", AuthUtil.userToken)
            .send(locationQuery);

        expect(queryResponse.status).to.equal(200);
        expect(queryResponse.body.results).to.be.an('array');
        expect(queryResponse.body.results.length).to.equal(1); // make sure there is at least one product returned.

        return;
    }


    @test('it should add a comment to the item')
    public async AddComment() {
        let createdId = await this.createBucketItem(AuthUtil.userToken);

        const testComment = "This is a test comment";

        let addComment = {
            comment: testComment,
        };

        let response = await api
            .post(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKET_ITEMS}${CONST.ep.COMMENTS}/${createdId}`)
            .set("x-access-token", AuthUtil.userToken)
            .send(addComment);

        console.dir(response.body.comments);

        expect(response.status).to.equal(202);
        expect(response.body.comments.length).to.equal(1);
        expect(response.body.comments[0].comment).to.equal(testComment);
        return;
    }

    @test('it should edit a comment to the item')
    public async EditComment() {
        let createdId = await this.createBucketItem(AuthUtil.userToken);

        const testComment = "This is a test comment";

        let addComment = {
            comment: testComment,
        };

        let responseAdd = await api
            .post(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKET_ITEMS}${CONST.ep.COMMENTS}/${createdId}`)
            .set("x-access-token", AuthUtil.userToken)
            .send(addComment);

        const createdCommentId = (responseAdd.body as ICommentable).comments[0]._id;

        const editedText = "Updated Text";

        let editComment = {
            comment: editedText,
            _id: createdCommentId,
        };

        let response = await api
            .patch(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKET_ITEMS}${CONST.ep.COMMENTS}/${createdId}`)
            .set("x-access-token", AuthUtil.userToken)
            .send(editComment);

        console.dir(response.body.comments);

        expect(response.status).to.equal(200);
        expect(response.body.comments.length).to.equal(1);
        expect(response.body.comments[0].comment).to.equal(editedText);
        return;
    }

    @test('it should delete the comment from the item')
    public async RemoveComment() {
        let createdId = await this.createBucketItem(AuthUtil.userToken);

        const testComment = "This is a test comment";

        let addComment = {
            comment: testComment,
        };

        let responseAdd = await api
            .post(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKET_ITEMS}${CONST.ep.COMMENTS}/${createdId}`)
            .set("x-access-token", AuthUtil.userToken)
            .send(addComment);

        const createdCommentId = (responseAdd.body as ICommentable).comments[0]._id;

        let removeRequest = {
            _id: createdCommentId
        }

        let response = await api
            .delete(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKET_ITEMS}${CONST.ep.COMMENTS}/${createdId}`)
            .set("x-access-token", AuthUtil.userToken)
            .send(removeRequest);

        expect(response.status).to.equal(200);
        expect(response.body.comments.length).to.equal(0);
        return;
    }

    private async createBucket(authToken: string): Promise<string> {
        let bucket: IBucket = {
            name: "Russia Is Amazing",
        }

        let createResponse = await api
            .post(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKETS}`)
            .set("x-access-token", authToken)
            .send(bucket);

        return createResponse.body._id;
    }

    private async createBucketItem(authToken: string): Promise<string> {
        let bucketItem: IBucketItem = {
			name: "Russia Is Amazing",
			description: "Don't get caught in the gulag"
        }

        let createResponse = await api
            .post(`${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKET_ITEMS}`)
            .set("x-access-token", authToken)
            .send(bucketItem);

        return createResponse.body._id;
    }
}
