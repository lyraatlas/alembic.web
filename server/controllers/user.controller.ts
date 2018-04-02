import { IUserDoc, User, ITokenPayload, IBaseModel, IUser, IBaseModelDoc } from '../models';
import { Router, Request, Response, RequestParamHandler, NextFunction, RequestHandler } from 'express';
import mongoose = require('mongoose');
import { Schema, Model, Document } from 'mongoose';
import { BaseController } from './base/base.controller';
import { CONST } from '../constants';
import { UserRepository } from "../repositories";
import { OwnershipType } from "../enumerations";
import { ApiErrorHandler } from '../api-error-handler';
const bcrypt = require('bcrypt');


export class UserController extends BaseController {

    public defaultPopulationArgument = null;
    public rolesRequiringOwnership = [CONST.GUEST_ROLE, CONST.USER_ROLE];
    public isOwnershipRequired = true;

    public repository = new UserRepository();

    constructor() {
        super();
    }

    public async updatePassword(request: Request, response: Response, next: NextFunction): Promise<IUser> {
        if (await this.isModificationAllowed(request, response, next)) {
            // first we need to get the user from the request.
            const user = await this.repository.getUserForPasswordCheck(this.getId(request));

            // now we have a user, with their password, we're going to validate their password.
            const passwordResult = await bcrypt.compare(request.body.oldPassword, user.password);
            if (passwordResult === false) {
                ApiErrorHandler.sendAuthFailure(response, 401, `Old Password Didn't match.  Password update error.`);
                return;
            }

            // If the user successfully suplied the old password, we're going to update with the new password. 
            user.password = await bcrypt.hash(request.body.newPassword, CONST.SALT_ROUNDS);

            await this.repository.updatePassword(user.id, user.password);

            user.password = '';

            return user;
        }
    }

    public async preCreateHook(User: IUserDoc): Promise<IUserDoc> {
        User.href = `${CONST.ep.API}${CONST.ep.V1}${CONST.ep.USERS}/${User._id}`;
        return User;
    }

    public async preSendResponseHook(User: IUserDoc): Promise<IUserDoc> {
        return User;
    }
}
