import { NextFunction, Request, Response } from 'express';
import { CONST } from '../../constants';
import { NotificationType } from "../../enumerations";
import { IBaseModelDoc, ITokenPayload } from '../../models';
import { ICommentable } from '../../models/commentable.interface';
import { BaseController } from '../base/base.controller';
import { NotificationUtility } from '../notifications/notification-utility';
import mongoose = require('mongoose');

export type Constructor<T = {}> = new (...args: any[]) => T;

export function Commentable<TBase extends Constructor>(Base: TBase) {
	return class extends Base {

		public static async addComment(request: Request, response: Response, next: NextFunction, controller: BaseController, notificationType: NotificationType): Promise<IBaseModelDoc> {
			try {
				let itemId = controller.getId(request);
				let item = await controller.repository.single(itemId);
				let currentToken: ITokenPayload = request[CONST.REQUEST_TOKEN_LOCATION];

				let commentableItem = (item as ICommentable);

				commentableItem.comments.push({
					comment: request.body.comment,
					commentBy: currentToken.userId,
					createdAt: new Date(),
				})

				// Save the update to the database
				await controller.repository.save(item);

				await NotificationUtility.addNotification(notificationType, item, currentToken);

				// Send the added comment back
				response.status(202).json(item);

				return item;
			} catch (err) { next(err); }
		}

		public static async removeComment(request: Request, response: Response, next: NextFunction, controller: BaseController): Promise<IBaseModelDoc> {
			try {
				let itemId = controller.getId(request);
				let item = await controller.repository.single(itemId);

				let currentToken: ITokenPayload = request[CONST.REQUEST_TOKEN_LOCATION];

				let commentableItem = (item as ICommentable);

				//Find the index of the comment, where the id matches, and the userId matches. 
				//If we don't find one where both of these things match, then the userID doesn't "own" the comment, and therefore can't delete it.
				let index = commentableItem.comments.findIndex((item) => {
					return (item._id == request.body._id && item.commentBy == currentToken.userId)
				})

				if (index != -1) {
					commentableItem.comments = commentableItem.comments.filter((item) => {
						item._id != request.body._id;
					});
				}

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

				commentableItem.comments.map((comment) => {
					if (comment._id == request.body._id && comment.commentBy == currentToken.userId) {
						comment.comment = request.body.comment
						comment.modifiedAt = new Date();
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