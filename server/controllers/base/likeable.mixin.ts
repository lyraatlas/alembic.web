import { IBucketDoc, Bucket, ITokenPayload, IBaseModel, IBucket, IBaseModelDoc, ILikeable } from '../../models';
import { Router, Request, Response, RequestParamHandler, NextFunction, RequestHandler } from 'express';
import mongoose = require('mongoose');
import { Schema, Model, Document } from 'mongoose';
import { BaseController } from '../base/base.controller';
import { CONST } from '../../constants';
import { BucketRepository } from "../../repositories";
import { OwnershipType } from "../../enumerations";

export type Constructor<T = {}> = new (...args: any[]) => T;

export function Likeable<TBase extends Constructor>(Base: TBase) {
    return class extends Base {

        public static async addLike(request: Request, response: Response, next: NextFunction, controller: BaseController): Promise<IBaseModelDoc> {
            try {
                let itemId = controller.getId(request);
                let item = await controller.repository.single(itemId);
                
                let currentToken: ITokenPayload = request[CONST.REQUEST_TOKEN_LOCATION];

                let likeableItem = (item as ILikeable);

                if(likeableItem.totalLikes){
                    likeableItem.totalLikes = ++likeableItem.totalLikes;
                }
                else{
                    likeableItem.totalLikes = 1;
                }

                // Only add the likedBy if it doesn't already exist.
                if(likeableItem.likedBy.indexOf(currentToken.userId) <0){
                    likeableItem.likedBy.push(currentToken.userId);
                }
    
                // Save the update to the database
                await controller.repository.save(item);
    
                // Send the new product which is not a template back.
                response.status(202).json(item);
    
                return item;
            } catch (err) { next(err); }
        }

        public static async removeLike(request: Request, response: Response, next: NextFunction, controller: BaseController): Promise<IBaseModelDoc> {
            try {
                let itemId = controller.getId(request);
                let item = await controller.repository.single(itemId);
                
                let currentToken: ITokenPayload = request[CONST.REQUEST_TOKEN_LOCATION];

                let likeableItem = (item as ILikeable);

                if(likeableItem.totalLikes){
                    likeableItem.totalLikes = --likeableItem.totalLikes;
                }
                else{
                    likeableItem.totalLikes = 0;
                }

                likeableItem.likedBy = likeableItem.likedBy.filter(val => val != currentToken.userId);
    
                // Save the update to the database
                await controller.repository.save(item);
    
                // Send the new product which is not a template back.
                response.status(200).json(item);
    
                return item;
            } catch (err) { next(err); }
        }

    };
}