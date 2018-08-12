import { IBucketItem } from "../models";
import { UploadFile } from "./upload-file.class";

export class UploadResponse{
	public bucketItem: IBucketItem;
	public uploadFile: UploadFile;
}