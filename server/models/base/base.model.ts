import { Schema, Model, Document } from 'mongoose';
import { IUser } from '..';

export interface IBaseModel {
    createdBy?: string | IUser;
    modifiedBy?: string | IUser;
    createdAt?: Date,
    updatedAt?: Date,
    href?: string,
}