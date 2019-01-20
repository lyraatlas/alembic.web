import { Schema } from 'mongoose';
import { mongoose } from '../config/database/database';
import * as enums from "../enumerations";
import { IBaseModel, IBaseModelDoc, IBucketItem, ICommentable, IHasImages, ILikeable, IOwned, ITimeStamped } from "./index";


export interface IBucket extends IBaseModel, ILikeable, IOwned, ITimeStamped, ICommentable, IHasImages {
    name?: string,
    description?: string,
    bucketItems?: IBucketItem[] | string[],
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
		commentByUser: {type: Object},
		createdAt: {type:Date},
		modifiedAt: {type:Date},
    })],
    images: [{
        order: { type: Number },
        isActive: { type: Boolean },
        variations: [{
            type: { type: Number, enum: [enums.EnumHelper.getValuesFromEnum(enums.ImageType)] },
            url: { type: String },
            width: { type: Number },
            height: { type: Number },
            key: {type: String},
        }],
    }],
    name: { type: String },
    description: { type: String },
    bucketItems: [{type: Schema.Types.ObjectId, ref: 'bucket-item'}],
    type: { type: Number, enum: [enums.EnumHelper.getValuesFromEnum(enums.BucketType)] },
    href: { type: String }
}, { timestamps: true });

// This is the free text search index, which is used by query
BucketSchema.index({ "name": "text", "description" : "text" });

//If you do any pre save methods, and you use fat arrow syntax 'this' doesn't refer to the document.
BucketSchema.pre('save', function (next) {
    //If there's any validators, this field requires validation.
    next();
});

// This will compile the schema for the object, and place it in this Instance.
export const Bucket = mongoose.model<IBucketDoc>('bucket', BucketSchema);