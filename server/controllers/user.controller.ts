import { IUserDoc, User, ITokenPayload, IBaseModel, IUser, IBaseModelDoc } from '../models';
import { Router, Request, Response, RequestParamHandler, NextFunction, RequestHandler } from 'express';
import mongoose = require('mongoose');
import { Schema, Model, Document } from 'mongoose';
import { BaseController } from './base/base.controller';
import { CONST } from '../constants';
import { UserRepository } from "../repositories";
import { OwnershipType } from "../enumerations";

export class UserController extends BaseController {

  public defaultPopulationArgument = {};
  public rolesRequiringOwnership = null;
  public isOwnershipRequired = true;

  protected repository = new UserRepository();

  constructor() {
    super();
  }

  // This will add ownerships whenever a document is created.
  // Here we can later add supplier ID, and also check that supplier ID in the checking logic.
  public addOwnerships(request: Request, response: Response, next: NextFunction, userDocument: IUserDoc): void {
    let currentToken: ITokenPayload = request[CONST.REQUEST_TOKEN_LOCATION];
    userDocument.owners = [{
      ownerId: currentToken.userId,
      ownershipType: OwnershipType.user
    }];
  }

  // For user documents we're going to test ownership based on organization id,
  // although we need to be testing based on supplier id as well.
  // TODO check ownership on supplier ID.
  public isOwner(request: Request, response: Response, next: NextFunction, userDocument: IUserDoc): boolean {
    // We'll assume this is only for CRUD
    // Get the current token, so we can get the ownerId in this case organization id off of here.
    let currentToken: ITokenPayload = request[CONST.REQUEST_TOKEN_LOCATION];

    // For now we're just going to check that the ownership is around organization.
    return super.isOwnerInOwnership(userDocument, currentToken.userId, OwnershipType.user);
  }

  public async preCreateHook(User: IUserDoc): Promise<IUserDoc> {
    User.href = `${CONST.ep.API}${CONST.ep.V1}${CONST.ep.USERS}/${User._id}`;
    return User;
  }

  public async preSendResponseHook(User: IUserDoc): Promise<IUserDoc> {
    return User;
  }
}
