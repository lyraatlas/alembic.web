import { NextFunction, Request, Response } from 'express';
import { CONST } from '../constants';
import { IBucketDoc, IBucketItemDoc } from '../models';
import { BucketItemRepository, BucketRepository } from "../repositories";
import { BaseController } from './base/base.controller';
import { Commentable } from './base/commentable.mixin';
import { ImageControllerMixin } from './base/images.controller.mixin';
import { Likeable } from './base/likeable.mixin';
import { BucketItemController } from './bucket-item.controller';
import mongoose = require('mongoose');

export class BucketControllerBase extends BaseController {

    public defaultPopulationArgument = {
        path: "bucketItems"
    };
    public rolesRequiringOwnership = [CONST.GUEST_ROLE, CONST.USER_ROLE];
    public isOwnershipRequired = true;

    public repository = new BucketRepository();
    public bucketItemRepository = new BucketItemRepository();
    public bucketItemController =  new BucketItemController();

    constructor() {
        super();
    }

    public async preCreateHook(Bucket: IBucketDoc): Promise<IBucketDoc> {
        Bucket.href = `${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKETS}/${Bucket._id}`;
        return Bucket;
    }

    public async preDestroyHook(request: Request, response: Response, next: NextFunction, bucket: IBucketDoc): Promise<IBucketDoc> {
        try {

            // Before we can destroy the images related to this bucket's items. 
            // keep in mind this bucket item might have been added to someone else's bucket.
            // so we can only clean up the images on this guy if he's not a part of any other bucket.
            // this is generally what querying inside an array looks like. db.inventory.find( { tags: "red" } )
            if (bucket.bucketItems && bucket.bucketItems.length > 0) {
                // For each of the bucket items on this bucket.
                for (let i = 0; i < bucket.bucketItems.length; i++) {

                    const bucketItem = bucket.bucketItems[i] as IBucketItemDoc;

                    // We need to check to see if this bucket item exists on any other buckets first. 
                    let otherBuckets = await this.repository.query({
                        bucketItems: bucketItem._id
                    }, null, null);

                    // Now if we have other buckets, we're not going to delete the images,... but we'll delete them if there's no other buckets.
                    if (!otherBuckets || otherBuckets == null || otherBuckets.length <= 1) {
                        // here we know that this bucket item doesn't exist in anyone elses bucket.
                        // so we can go ahead and delete the images off of it. 
                        await BucketItemController.destroyImages(await this.bucketItemRepository.single(bucketItem._id));

                        // For now we're not going to go an delete the bucket item.
                        // it's a pain, and it's probably not that big of a deal.  In theory we can write something that will spit out all the orphaned
                        // bucket items and delete those. 
                    }
                }
            }

            return await BucketController.destroyImages(bucket);

        } catch (err) { next(err); }

    }

    public async preSendResponseHook(Bucket: IBucketDoc): Promise<IBucketDoc> {
        return Bucket;
    }
}

// All of our mixin controllers.
export const BucketController = ImageControllerMixin(Commentable(Likeable(BucketControllerBase)));