import { CONST } from '../constants';
import { IBaseModelDoc } from '../models';
import { NotificationRepository } from '../repositories/index';
import { BaseController } from './base/base.controller';
import mongoose = require('mongoose');

export class NotificationController extends BaseController {

	public defaultPopulationArgument = null;

	public rolesRequiringOwnership = [CONST.USER_ROLE, CONST.GUEST_ROLE];
	public isOwnershipRequired = false;

	public repository = new NotificationRepository();

	constructor() {
		super();
	}

	public async preSendResponseHook(item: IBaseModelDoc): Promise<IBaseModelDoc> {
		return item;
	}
}
