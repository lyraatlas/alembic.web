import { User, IUserDoc } from "../models/index";
import { Model } from "mongoose";
import { BaseRepository } from "./index";

export class UserRepository extends BaseRepository<IUserDoc>{
    protected mongooseModelInstance: Model<IUserDoc> = User;
    
    public constructor() {
        super();
    }
}