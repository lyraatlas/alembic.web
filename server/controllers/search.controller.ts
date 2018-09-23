import { NextFunction, Request, Response } from 'express';
import { CONST } from '../constants';
import { IBucketDoc, ICommentable } from '../models';
import { IQueryResponse } from '../models/query-response.interface';
import { BucketItemRepository, BucketRepository } from "../repositories";
import { CommentRepository } from '../repositories/comment.repo';
import { BaseController } from './base/base.controller';
import { Commentable } from './base/commentable.mixin';
import { ImageControllerMixin } from './base/images.controller.mixin';
import { Likeable } from './base/likeable.mixin';
import { BucketItemController } from './bucket-item.controller';
import mongoose = require('mongoose');

export class SearchControllerBase extends BaseController {

    public defaultPopulationArgument = {
        path: "bucketItems"
	};
	
	public bucketPopulationArgument = {
		path: "bucketItems",
	};

	public bucketItemPopulationArgument ={
		path: "images"
	};

    public rolesRequiringOwnership = [CONST.GUEST_ROLE, CONST.USER_ROLE];
    public isOwnershipRequired = true;

    public repository = new BucketRepository();
	public bucketItemRepository = new BucketItemRepository();
	public commentRepository = new CommentRepository();
    public bucketItemController =  new BucketItemController();

    constructor() {
        super();
	}

	public async preSendQueryResponseHook(request: Request, response: Response, next: NextFunction, queryResponse: IQueryResponse<IBucketDoc>) : Promise<IQueryResponse<IBucketDoc>>{
		// let queryReq = request.body as SearchCriteria;
		// if(queryReq.includeComments){
		// 	let items = queryResponse.results;
		// 	for (let i = 0; i < items.length; i++) {
		// 		let bucket = items[i];
		// 		bucket = await this.populateComments(bucket) as IBucketDoc;
		// 	}
		// }
		return queryResponse;
	}
	

    public async preCreateHook(Bucket: IBucketDoc): Promise<IBucketDoc> {
		return null;
    }

    public async preDestroyHook(request: Request, response: Response, next: NextFunction, bucket: IBucketDoc): Promise<IBucketDoc> {
		return null;
	}
	
	public async populateComments(item: ICommentable): Promise<ICommentable>{
		if(item && item.comments && item.comments.length > 0){
			for (let index = 0; index < item.comments.length; index++) {
				let comment = item.comments[index];
				item.comments[index] =await this.commentRepository.getCommentDetails(comment);
			}
		}
        return item;
	}

    public async preSendResponseHook(bucket: IBucketDoc): Promise<IBucketDoc> {
		return null;
    }
}

// All of our mixin controllers.
export const SearchController = ImageControllerMixin(Commentable(Likeable(SearchControllerBase)));