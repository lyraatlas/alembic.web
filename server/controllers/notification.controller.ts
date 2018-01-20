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

  public rolesRequiringOwnership = [];
  public isOwnershipRequired = false;

  protected repository = new NotificationRepository();

   // This will add ownerships whenever a document is created.
  // Here we can later add order ID, and also check that order ID in the checking logic.
  public addOwnerships(request: Request, response: Response, next: NextFunction, orderDoc: INotificationDoc): void {
    return;
  }

  // TODO cleanup the security here.  Not sure we should be saying everyone owns all the notifications.
  public isOwner(request: Request, response: Response, next: NextFunction, orderDoc: INotificationDoc): boolean {
    return true;
  }

  constructor() {
    super();
  }
}
