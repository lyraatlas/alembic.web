import { mongoose } from '../config/database/database';
import { Schema, Model, Document, model } from 'mongoose';
import { IBaseModel, IBaseModelDoc, ILikeable, IOwned, ITimeStamped, IBucketItem } from "./index";
import * as enums from "../enumerations";
import { IImage } from './image.interface';
import { ICommentable } from './commentable.interface';


export interface IBucket extends IBaseModel, ILikeable, IOwned, ITimeStamped, ICommentable {
    name?: string,
    description?: string,
    bucketItems?: IBucketItem[],
    type?: enums.BucketType,
    href?: string,
}

export interface IBucketDoc extends IBucket, IBaseModelDoc {

}

const BucketSchema = new Schema({
    owners: [{
        _id: { auto: false },
        ownerId:  { type: Schema.Types.ObjectId },
        ownershipType: { type: Number, enum: [enums.EnumHelper.getValuesFromEnum(enums.OwnershipType)] },
    }],
    likedBy: [{type: Schema.Types.ObjectId, ref: 'user'}],
    comments: [new Schema({
        commentBy: {type: Schema.Types.ObjectId, ref: 'user'},
        comment: { type: String },
    })],
    totalComments: {type: Number},
    totalCount: {type: Number},
    name: { type: String },
    description: { type: String },
    bucketItems: {type: Schema.Types.ObjectId, ref: 'bucket-item'},
    type: { type: Number, enum: [enums.EnumHelper.getValuesFromEnum(enums.BucketType)] },
    href: { type: String }
}, { timestamps: true });

//If you do any pre save methods, and you use fat arrow syntax 'this' doesn't refer to the document.
BucketSchema.pre('save', function (next) {
    //If there's any validators, this field requires validation.
    next();
});

// This will compile the schema for the object, and place it in this Instance.
export const Bucket = mongoose.model<IBucketDoc>('bucket', BucketSchema);