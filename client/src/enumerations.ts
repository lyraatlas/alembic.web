export enum AlertType {
	info = 1,
	success = 2,
	warning = 3,
	danger = 4,
	empty = 5
}

export enum SearchBarEventType {
	searched = 1,
	navigated = 2
}

export enum CommentEventType {
	created = 1,
	updated = 2,
	removed = 3,
	cancelAdd = 4,
}

export enum BucketEventType {
	created = 1,
	edited = 2,
	removed = 3,
	cancelCreate = 4,
	cancelEdit = 5,
	startCreate = 6,
	startEdit = 8,
}

export enum BucketItemEventType {
	created = 1,
	edited = 2,
	removed = 3,
	cancelCreate = 4,
	cancelEdit = 5,
	startCreate = 6,
	startEdit = 8,
	startDelete = 9,
}

export enum UploadStatus {
	pending = 1,
	uploading = 2,
	finished = 3,
	error = 4,
}

export enum BucketType {
	country = 1,
	activity = 2,
	continent = 3,
}

export enum EditControlMode {
	edit = 1,
	create = 2,
	none = 3,
}

export enum NotificationType {
	BucketLiked = 1,
	BucketItemLiked = 2,
	BucketCommentAded = 3,
	BucketItemCommentAdded = 4,
}

export enum OrderStatus {
	entered = 1,
	sent = 2,
	accepted = 3,
	rejected = 4,
	pickedUp = 5,
	delivered = 6,
	completed = 7
}

export enum NotificationType {
	NewOrder_Supplier = 1,
	OrderAccepted_Core = 2,
	OrderRejected_Core = 3,
	InventoryAdded_Core = 4,
	InventoryFinalized_Core = 5,
	InventoryRemoved_Core = 6,
	PriceUpdated_Core = 7,
	TeamMemberJoinRequest_Supplier = 8,
	SupplierAwaitingApproval_Core = 9
}

export enum OwnershipType {
	supplier = 1,
	organization = 2,
	user = 3
}

export enum ProductType {
	stem = 1,
	pottedPlant = 2,
	tool = 3
}

export enum OrderItemEventType {
	newAdded = 1,
	edited = 2,
	saved = 3,
	removed = 4,
}

export enum ProductImageEventType {
	uploaded = 1,
	edited = 2,
	saved = 3,
	removed = 4,
	added = 5,
}

export enum ImageType {
	icon = 1,
	thumbnail = 2,
	small = 3,
	medium = 4,
	large = 5,
	raw = 6
}

export enum AddressType {
	pickup = 1,
	business = 2,
	billing = 3,
}

export enum EmailType {
	pickup = 1,
	business = 2,
	billing = 3,
}

export enum ContactType {
	pickup = 1,
	business = 2,
	billing = 3,
}

export enum PhoneType {
	pickup = 1,
	business = 2,
	billing = 3,
}

export enum PrimaryColor {
	red = 1,
	blue = 2,
	green = 3,
	white = 4,
	brown = 5,
	orange = 6,
	yellow = 7,
	purple = 8,
	black = 9,
	other = 10,
}

export class EnumHelper {
	public static getValuesFromEnum<E>(e: E): Array<Number> {
		let keys = Object.keys(e);
		let enumValues = new Array<Number>();
		keys.forEach(key => {
			enumValues.push(e[key]);
		});
		return enumValues;
	}

	public static getSelectors(definition) {
		return Object.keys(definition)
			.map(key => ({ value: definition[key], name: key })).filter(f => !isNaN(Number(f.value)));
	}
}

export const MimeType = {
	JSON: 'application/json',
	MULTIPART: 'multipart/form-data',
	TEXT: 'text/plain'
};

//Enum Parsing - Remember basically you really need to cast it as string for it to work. 
//var colorId = <string>myOtherObject.colorId; // Force string value here
//var color: Color = Color[colorId]; // Fixes lookup here.