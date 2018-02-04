import { mongoose } from '../config/database/database';
import { Schema, Model, Document, model } from 'mongoose';
import { IBaseModel, IBaseModelDoc } from "./index";


// Really the email verification is just a map between the 
// user and when this record will expire.  In theory we need to clean these records up later.
export interface IEmailVerification extends IBaseModel {
    userId: string;
    expiresOn: string;
}

// This will give us an interface that's a composite of both base model, and document.
export interface IEmailVerificationDoc extends IEmailVerification, IBaseModelDoc {

}

const EmailVerificationSchema = new Schema({
    userId: { type : Schema.Types.ObjectId, ref: 'user', required: true },
    expiresOn: { type: String , required: true}
},{timestamps:true});

//If you do any pre save methods, and you use fat arrow syntax 'this' doesn't refer to the document.
EmailVerificationSchema.pre('save',function(next){
    //If there's any validators, this field requires validation.
    next();
});

// This will compile the schema for the object, and place it in this Instance.
export const EmailVerification = mongoose.model<IEmailVerificationDoc>('email-verification', EmailVerificationSchema);