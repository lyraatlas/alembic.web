import { Bucket, IBucketDoc } from "../models/index";
import { Model } from "mongoose";
import { BaseRepository } from "./index";

export class BucketRepository extends BaseRepository<IBucketDoc>{
    protected mongooseModelInstance: Model<IBucketDoc> = Bucket;
    
    public constructor() {
        super();
    }
}