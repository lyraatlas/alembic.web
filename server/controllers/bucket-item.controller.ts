import { IBucketItemDoc, BucketItem, ITokenPayload, IBaseModel, IBucketItem, IBaseModelDoc } from '../models';
import { Router, Request, Response, RequestParamHandler, NextFunction, RequestHandler } from 'express';
import mongoose = require('mongoose');
import { Schema, Model, Document } from 'mongoose';
import { BaseController } from './base/base.controller';
import { CONST } from '../constants';
import { BucketItemRepository } from "../repositories";
import { OwnershipType } from "../enumerations";

export class BucketItemController extends BaseController {

  public defaultPopulationArgument = {};
  public rolesRequiringOwnership = null;
  public isOwnershipRequired = true;

  protected repository = new BucketItemRepository();

  constructor() {
    super();
  }

  // This will add ownerships whenever a document is created.
  // Here we can later add supplier ID, and also check that supplier ID in the checking logic.
  public addOwnerships(request: Request, response: Response, next: NextFunction, bucketItemDocument: IBucketItemDoc): void {
    let currentToken: ITokenPayload = request[CONST.REQUEST_TOKEN_LOCATION];
    bucketItemDocument.owners = [{
      ownerId: currentToken.userId,
      ownershipType: OwnershipType.user
    }];
  }

  // For bucketItem documents we're going to test ownership based on organization id,
  // although we need to be testing based on supplier id as well.
  // TODO check ownership on supplier ID.
  public isOwner(request: Request, response: Response, next: NextFunction, bucketItemDocument: IBucketItemDoc): boolean {
    // We'll assume this is only for CRUD
    // Get the current token, so we can get the ownerId in this case organization id off of here.
    let currentToken: ITokenPayload = request[CONST.REQUEST_TOKEN_LOCATION];

    // For now we're just going to check that the ownership is around organization.
    return super.isOwnerInOwnership(bucketItemDocument, currentToken.userId, OwnershipType.user);
  }

  public async preCreateHook(BucketItem: IBucketItemDoc): Promise<IBucketItemDoc> {
    BucketItem.href = `${CONST.ep.API}${CONST.ep.V1}${CONST.ep.BUCKET_ITEMS}/${BucketItem._id}`;
    return BucketItem;
  }

  public async preSendResponseHook(BucketItem: IBucketItemDoc): Promise<IBucketItemDoc> {
    return BucketItem;
  }
}
