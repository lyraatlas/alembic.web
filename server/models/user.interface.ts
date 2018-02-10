import { mongoose } from '../config/database/database';
import { Schema, Model, Document, model } from 'mongoose';
import { IBaseModel, IBaseModelDoc, IOwned, ITimeStamped } from "./index";
import * as enums from '../enumerations';

export interface IUser extends IBaseModel, IOwned, ITimeStamped {
    firstName?: string,
    lastName?: string,
    password?: string;
    email?: string;
    href?: string;
    roles: string[];
    // This will be set to true whenever a user changes their password / or we require them to login again
    // This is used by the authentication controller to revoke the renewal of a token.  
    isTokenExpired: boolean; 
    isEmailVerified: boolean;
    isActive: boolean;
    createdAt?: Date; //Automatically created by mongoose.
    modifiedAt?: Date; //Automatically created by mongoose.
    facebookAuth?: {
        id?: string,
        token?: string,
        name?: string,
    }
    twitterAuth?:{
        id?           : string,
        token?        : string,
        displayName?  : string,
        username?     : string
    }
    googleAuth?:{
        id?           : string,
        token?        : string,
        name?         : string
    }
    instagramAuth?:{
        id           : string,
        token?        : string,
        name?         : string,
        username?     : string
    }
}

export interface IUserDoc extends IUser, IBaseModelDoc {

}

const UserSchema = new Schema({
    firstName: {type: String, required: false},
    lastName: {type: String, required: false},
    email: {type:String},
    password: {type: String, required: false, select: false},
    isTokenExpired: {type : Boolean, required: true, default: false},
    isEmailVerified: {type : Boolean, required: true, default: false},
    roles: [{type: String}],
    href: {type:String},
    isActive: {type: Boolean, required: true, default: true},
    facebookAuth         : {
        id           : {type:String},
        token        : {type:String},
        name         : {type:String}
    },
    twitterAuth          : {
        id           : {type:String},
        token        : {type:String},
        displayName  : {type:String},
        username     : {type:String}
    },
    googleAuth           : {
        id           : {type:String},
        token        : {type:String},
        name         : {type:String}
    },
    instagramAuth           : {
        id           : {type:String},
        token        : {type:String},
        name         : {type:String},
        username     : {type:String}
    }
},{timestamps:true});

//If you do any pre save methods, and you use fat arrow syntax 'this' doesn't refer to the document.
UserSchema.pre('save',function(next){
    //If there's any validators, this field requires validation.
    next();
});

// This will compile the schema for the object, and place it in this Instance.
export const User = mongoose.model<IUserDoc>('user', UserSchema);