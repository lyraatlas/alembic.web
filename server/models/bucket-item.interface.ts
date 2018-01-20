import { mongoose } from '../config/database/database';
import { Schema, Model, Document, model } from 'mongoose';
import { IBaseModel, IBaseModelDoc } from "./index";
import * as enums from "../enumerations";
import { IImage } from './image.interface';
import { ILikeable } from './likeable.interface';
import { IOwned } from './owned.interface';


export interface IBucketItem extends IBaseModel, ILikeable, IOwned {
    name?: string,
    description?: string,
    href?: string,
    createdBy?: string;
    modifiedBy?: string;
    createdAt?: Date,
    modifiedAt?: Date,
}

export interface IBucketItemDoc extends IBucketItem, IBaseModelDoc {

}

const BucketItemSchema = new Schema({
    ownerships: [{
        _id: { auto: false },
        ownerId:  { type: Schema.Types.ObjectId },
        ownershipType: { type: Number, enum: [enums.EnumHelper.getValuesFromEnum(enums.OwnershipType)] },
    }],
    likeBy: [{type: Schema.Types.ObjectId, ref: 'user'}],
    totalCount: {type: Number},
    name: { type: String },
    description: { type: String },
    href: { type: String }
}, { timestamps: true });

//If you do any pre save methods, and you use fat arrow syntax 'this' doesn't refer to the document.
BucketItemSchema.pre('save', function (next) {
    //If there's any validators, this field requires validation.
    next();
});

// This will compile the schema for the object, and place it in this Instance.
export const BucketItem = mongoose.model<IBucketItemDoc>('bucket-item', BucketItemSchema);