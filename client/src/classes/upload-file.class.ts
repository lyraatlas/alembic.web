import { UploadStatus } from "../enumerations";

export class UploadFile {
	public id: string;
	public url?: string;
	public file: File | string;
	public status: UploadStatus;
	public statusText: string;
}
