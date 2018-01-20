import { BucketItem, IBucketItemDoc } from "../models/index";
import { Model } from "mongoose";
import { BaseRepository } from "./index";

export class BucketItemRepository extends BaseRepository<IBucketItemDoc>{
    protected mongooseModelInstance: Model<IBucketItemDoc> = BucketItem;
    
    public constructor() {
        super();
    }
}