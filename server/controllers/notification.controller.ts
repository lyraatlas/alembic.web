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

  constructor() {
    super();
  }
}
