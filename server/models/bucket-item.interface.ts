import { Schema } from 'mongoose';
import { mongoose } from '../config/database/database';
import * as enums from "../enumerations";
import { ICommentable } from './commentable.interface';
import { IHasLocation } from './has-location.interface';
import { IBaseModel, IBaseModelDoc, IHasImages, ILikeable, IOwned, ITimeStamped } from "./index";


export interface IBucketItem extends IBaseModel, ILikeable, IOwned, ITimeStamped, ICommentable, IHasImages, IHasLocation {
    name?: string,
    description?: string,
    href?: string,
}

export interface IBucketItemDoc extends IBucketItem, IBaseModelDoc {

}

const BucketItemSchema = new Schema({
    owners: [{
        _id: { auto: false },
        ownerId:  { type: Schema.Types.ObjectId },
        ownershipType: { type: Number, enum: [enums.EnumHelper.getValuesFromEnum(enums.OwnershipType)] },
    }],
    likedBy: [{type: Schema.Types.ObjectId, ref: 'user'}],
    comments: [{
        commentBy: {type: Schema.Types.ObjectId, ref: 'user'},
        comment: { type: String },
		commentByUser: {type: Object},
		createdAt: {type:Date},
		modifiedAt: {type:Date},
    }],
    // What the mongo compass query looks like: {"productLocation":{"$geoWithin":{"$centerSphere":[[40.76665209596496,-73.98568992400604],4.4717033545255673e-7]}}}
    // The order here is Longitude, and then Latitude.
    location: { 'type': {type: String, enum: "Point", default: "Point"}, coordinates: { type: [Number], default: [0,0] } },
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
    href: { type: String }
}, { timestamps: true });

BucketItemSchema.index({location: '2dsphere'});

//If you do any pre save methods, and you use fat arrow syntax 'this' doesn't refer to the document.
BucketItemSchema.pre('save', function (next) {
    //If there's any validators, this field requires validation.
    next();
});

// This will compile the schema for the object, and place it in this Instance.
export const BucketItem = mongoose.model<IBucketItemDoc>('bucket-item', BucketItemSchema);