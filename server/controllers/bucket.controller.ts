import { IBucketDoc, Bucket, ITokenPayload, IBaseModel, IBucket, IBaseModelDoc } from '../models';
import { Router, Request, Response, RequestParamHandler, NextFunction, RequestHandler } from 'express';
import mongoose = require('mongoose');
import { Schema, Model, Document } from 'mongoose';
import { BaseController } from './base/base.controller';
import { CONST } from '../constants';
import { BucketRepository } from "../repositories";
import { OwnershipType } from "../enumerations";
import { Likeable } from './base/likeable.mixin';
import { Commentable } from './base/commentable.mixin';

export class BucketControllerBase extends BaseController {

    public defaultPopulationArgument = {
        path: "bucketItems"
    };
    public rolesRequiringOwnership = [CONST.GUEST_ROLE, CONST.USER_ROLE];
    public isOwnershipRequired = true;

    public repository = new BucketRepository();

    constructor() {
        super();
    }

    public async preCreateHook(Bucket: IBucketDoc): Promise<IBucketDoc> {
        Bucket.href = `${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKETS}/${Bucket._id}`;
        return Bucket;
    }

    public async preSendResponseHook(Bucket: IBucketDoc): Promise<IBucketDoc> {
        return Bucket;
    }
}

// All of our mixin controllers.
export const BucketController = Commentable(Likeable(BucketControllerBase));