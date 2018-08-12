import { UploadStatus } from "../enumerations";

export class UploadFile {
	public url?: string;
	public file: File | string;
	public status: UploadStatus;
	public statusText: string;
}
