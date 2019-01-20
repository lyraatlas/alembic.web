import { NextFunction, Request, Response } from 'express';
import { ControllerUtilities } from '.';
import { CONST } from '../constants';
import { IBucketDoc, IBucketItemDoc, SearchOptions } from '../models';
import { IBucketItemSearchCriteria } from '../models/bucket-item-search-criteria.interface';
import { IQueryResponse } from '../models/query-response.interface';
import { BucketItemRepository, BucketRepository } from "../repositories";
import { CommentRepository } from '../repositories/comment.repo';
import { BaseController } from './base/base.controller';
import { Commentable } from './base/commentable.mixin';
import { ImageControllerMixin } from './base/images.controller.mixin';
import { Likeable } from './base/likeable.mixin';
import mongoose = require('mongoose');

export class BucketItemControllerBase extends BaseController {

    public defaultPopulationArgument = null;
    public rolesRequiringOwnership = [CONST.GUEST_ROLE, CONST.USER_ROLE];
    public isOwnershipRequired = true;

    public repository = new BucketItemRepository();
	public bucketRepo = new BucketRepository();
	public commentRepository = new CommentRepository();

    constructor() {
        super();
    }

    /*
    Here's the request, and how it's going to be shaped. 
    // bucketItemId will also need to be on the path  /bucket-items/id
    // this will be how we can check for ownership. 
        {
            "bucketId": "123",
            "bucketItemId": "567" 
        }
    */
    public async deleteFromBucket(request: Request, response: Response, next: NextFunction): Promise<IBucketItemDoc>{
        try {
            if (await super.isModificationAllowed(request, response, next)) {
                // Before we destroy, we want our controllers to have the opportunity to cleanup any related data.
                const bucketItemDoc = await this.repository.single(super.getId(request));
                const bucketDoc = await this.bucketRepo.single(request.body.bucketId);

                if(!bucketDoc) { throw { message: "Bucket Not Found", status: 404 };}
                if (!bucketItemDoc) { throw { message: "Bucket Item Not Found", status: 404 }; }

                // We're going to clean this up off the bucket first, because if we don't find it on the bucket, then we probably shouldn't be deleting the item for it.
                const index = (bucketDoc.bucketItems as IBucketItemDoc[]).findIndex(item =>{
                    return item[`_id`] == request.body.bucketItemId;
                });

                bucketDoc.bucketItems.splice(index,1);

                this.bucketRepo.update(bucketDoc.id,bucketDoc);

                return super.destroy(request,response,next);
            }
        } catch (err) { next(err); }
    }

    public async preCreateHook(BucketItem: IBucketItemDoc): Promise<IBucketItemDoc> {
        BucketItem.href = `${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKET_ITEMS}/${BucketItem._id}`;
        return BucketItem;
    }

    public async preSendResponseHook(bucketItem: IBucketItemDoc): Promise<IBucketItemDoc> {
		// We're going to get details on the comments.
		await new ControllerUtilities().populateComments(bucketItem);

        return bucketItem;
	}

    public async preDestroyHook(request: Request, response: Response, next: NextFunction, bucketItem: IBucketItemDoc): Promise<IBucketItemDoc> {
        return await BucketItemController.destroyImages(bucketItem);
	}

	public async preSendQueryResponseHook(request: Request, response: Response, next: NextFunction, queryResponse: IQueryResponse<IBucketDoc>) : Promise<IQueryResponse<IBucketDoc>>{
		let searchOptions = request.body as SearchOptions;
		if(queryResponse && 
			queryResponse.results && 
			searchOptions.searchCriteria && 
			(searchOptions.searchCriteria as IBucketItemSearchCriteria).includeComments){

			for (let i = 0; i < queryResponse.results.length; i++) {
				let bucketItem = queryResponse.results[i];
				queryResponse.results[i] = await new ControllerUtilities().populateComments(bucketItem) as IBucketDoc;
			}

		}
		return queryResponse;
	}
}

// All of our mixin controllers.
export const BucketItemController = ImageControllerMixin(Commentable(Likeable(BucketItemControllerBase)));
