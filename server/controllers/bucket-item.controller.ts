import { IBucketItemDoc, BucketItem, ITokenPayload, IBaseModel, IBucketItem, IBaseModelDoc } from '../models';
import { Router, Request, Response, RequestParamHandler, NextFunction, RequestHandler } from 'express';
import mongoose = require('mongoose');
import { Schema, Model, Document } from 'mongoose';
import { BaseController } from './base/base.controller';
import { CONST } from '../constants';
import { BucketItemRepository } from "../repositories";
import { OwnershipType } from "../enumerations";
import { Likeable } from './base/likeable.mixin';
import { Commentable } from './base/commentable.mixin';

export class BucketItemControllerBase extends BaseController {

    public defaultPopulationArgument = {};
    public rolesRequiringOwnership = [CONST.GUEST_ROLE, CONST.USER_ROLE];
    public isOwnershipRequired = true;

    public repository = new BucketItemRepository();

    constructor() {
        super();
    }

    public async preCreateHook(BucketItem: IBucketItemDoc): Promise<IBucketItemDoc> {
        BucketItem.href = `${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKET_ITEMS}/${BucketItem._id}`;
        return BucketItem;
    }

    public async preSendResponseHook(BucketItem: IBucketItemDoc): Promise<IBucketItemDoc> {
        return BucketItem;
    }
}

// All of our mixin controllers.
export const BucketItemController = Commentable(Likeable(BucketItemControllerBase));
