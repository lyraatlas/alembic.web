import { IBucketDoc, Bucket, ITokenPayload, IBaseModel, IBucket, IBaseModelDoc, ILikeable } from '../../models';
import { Router, Request, Response, RequestParamHandler, NextFunction, RequestHandler } from 'express';
import mongoose = require('mongoose');
import { Schema, Model, Document } from 'mongoose';
import { BaseController } from '../base/base.controller';
import { CONST } from '../../constants';
import { BucketRepository } from "../../repositories";
import { OwnershipType } from "../../enumerations";
import { ICommentable } from '../../models/commentable.interface';

export type Constructor<T = {}> = new (...args: any[]) => T;

export function Commentable<TBase extends Constructor>(Base: TBase) {
    return class extends Base {

        public static async addComment(request: Request, response: Response, next: NextFunction, controller: BaseController): Promise<IBaseModelDoc> {
            try {
                let itemId = controller.getId(request);
                let item = await controller.repository.single(itemId);
                
                let currentToken: ITokenPayload = request[CONST.REQUEST_TOKEN_LOCATION];
    
                let commentableItem = (item as ICommentable);

                commentableItem.totalComments = ++commentableItem.totalComments;
                commentableItem.comments.push({
                    comment: request.body.comment,
                    commentBy: currentToken.userId,
                    createdAt: new Date(),
                })
    
                // Save the update to the database
                await controller.repository.save(item);
    
                // Send the new product which is not a template back.
                response.status(200).json(item);
    
                return item;
            } catch (err) { next(err); }
        }
    
        public static async removeComment(request: Request, response: Response, next: NextFunction, controller: BaseController): Promise<IBaseModelDoc> {
            try {
                let itemId = controller.getId(request);
                let item = await controller.repository.single(itemId);
                
                let currentToken: ITokenPayload = request[CONST.REQUEST_TOKEN_LOCATION];
    
                let commentableItem = (item as ICommentable);

                commentableItem.totalComments = --commentableItem.totalComments;
                commentableItem.comments = commentableItem.comments.filter( (item) => {
                    item._id != request.body._id
                });
    
                // Save the update to the database
                await controller.repository.save(item);
    
                // Send the new product which is not a template back.
                response.status(200).json(item);
    
                return item;
            } catch (err) { next(err); }
        }
    
        public static async editComment(request: Request, response: Response, next: NextFunction, controller: BaseController): Promise<IBaseModelDoc> {
            try {
                let itemId = controller.getId(request);
                let item = await controller.repository.single(itemId);
                
                let currentToken: ITokenPayload = request[CONST.REQUEST_TOKEN_LOCATION];
    
                let commentableItem = (item as ICommentable);

                commentableItem.totalComments = --commentableItem.totalComments;
                commentableItem.comments.map( (item) => {
                    if(item._id === request.body._id){
                        item.comment = request.body.comment
                        item.modifiedAt = new Date();
                    }
                });
    
                // Save the update to the database
                await controller.repository.save(item);
    
                // Send the new product which is not a template back.
                response.status(200).json(item);
    
                return item;
            } catch (err) { next(err); }
        }

    };
}