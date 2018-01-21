import { IBucketDoc, Bucket, ITokenPayload, IBaseModel, IBucket, IBaseModelDoc } from '../models';
import { Router, Request, Response, RequestParamHandler, NextFunction, RequestHandler } from 'express';
import mongoose = require('mongoose');
import { Schema, Model, Document } from 'mongoose';
import { BaseController } from './base/base.controller';
import { CONST } from '../constants';
import { BucketRepository } from "../repositories";
import { OwnershipType } from "../enumerations";

export class BucketController extends BaseController {

  public defaultPopulationArgument = {
    path: "bucketItems"
  };
  public rolesRequiringOwnership = [CONST.GUEST_ROLE,CONST.USER_ROLE];
  public isOwnershipRequired = true;

  protected repository = new BucketRepository();

  constructor() {
    super();
  }

  // This will add ownerships whenever a document is created.
  // Here we can later add supplier ID, and also check that supplier ID in the checking logic.
  public addOwnerships(request: Request, response: Response, next: NextFunction, bucketDocument: IBucketDoc): void {
    let currentToken: ITokenPayload = request[CONST.REQUEST_TOKEN_LOCATION];
    bucketDocument.owners = [{
      ownerId: currentToken.userId,
      ownershipType: OwnershipType.user
    }];
  }

  // For bucket documents we're going to test ownership based on organization id,
  // although we need to be testing based on supplier id as well.
  // TODO check ownership on supplier ID.
  public isOwner(request: Request, response: Response, next: NextFunction, bucketDocument: IBucketDoc): boolean {
    // We'll assume this is only for CRUD
    // Get the current token, so we can get the ownerId in this case organization id off of here.
    let currentToken: ITokenPayload = request[CONST.REQUEST_TOKEN_LOCATION];

    // For now we're just going to check that the ownership is around organization.
    return super.isOwnerInOwnership(bucketDocument, currentToken.userId, OwnershipType.user);
  }

  public async preCreateHook(Bucket: IBucketDoc): Promise<IBucketDoc> {
    Bucket.href = `${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKETS}/${Bucket._id}`;
    return Bucket;
  }

  public async preSendResponseHook(Bucket: IBucketDoc): Promise<IBucketDoc> {
    return Bucket;
  }
}
