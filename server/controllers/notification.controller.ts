import { INotification, Notification, ITokenPayload, IBaseModel, INotificationDoc, IValidationError } from '../models';
import { Router, Request, Response, RequestParamHandler, NextFunction, RequestHandler } from 'express';
import mongoose = require('mongoose');
import { Schema, Model, Document } from 'mongoose';
import { BaseController } from './base/base.controller';
import { CONST } from '../constants';
import { AmazonS3Service } from '../services/index';
import * as log from 'winston';
import { NotificationRepository } from '../repositories/index';
import { ApiErrorHandler } from '../api-error-handler';
import * as enums from '../enumerations';

export class NotificationController extends BaseController {

  public defaultPopulationArgument = null;

  public rolesRequiringOwnership = [CONST.USER_ROLE, CONST.GUEST_ROLE];
  public isOwnershipRequired = false;

  public repository = new NotificationRepository();

   // This will add ownerships whenever a document is created.
  // Here we can later add order ID, and also check that order ID in the checking logic.
  public addOwnerships(request: Request, response: Response, next: NextFunction, notificationDoc: INotificationDoc): void {
    let currentToken: ITokenPayload = request[CONST.REQUEST_TOKEN_LOCATION];
    notificationDoc.owners.push({
        ownerId: currentToken.userId,
        ownershipType: enums.OwnershipType.user
    });
  }

  // TODO cleanup the security here.  Not sure we should be saying everyone owns all the notifications.
  public isOwner(request: Request, response: Response, next: NextFunction, notificationDoc: INotificationDoc): boolean {
    // We'll assume this is only for CRUD
    // Get the current token, so we can get the ownerId in this case organization id off of here.
    let currentToken: ITokenPayload = request[CONST.REQUEST_TOKEN_LOCATION];

    // For now we're just going to check that the ownership is around organization.
    return super.isOwnerInOwnership(notificationDoc, currentToken.userId, enums.OwnershipType.user);
  }

  constructor() {
    super();
  }
}
