import { EmailVerification, IEmailVerificationDoc } from "../models/index";
import { Model } from "mongoose";
import { BaseRepository } from "./index";

export class EmailVerificationRepository extends BaseRepository<IEmailVerificationDoc>{
    protected mongooseModelInstance: Model<IEmailVerificationDoc> = EmailVerification;
    
    public constructor() {
        super();
    }
}