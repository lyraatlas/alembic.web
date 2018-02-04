export enum BucketType{
    country =1,
    activity =2,
    continent =3,
}


export enum OrganizationType{
    system = 1,
    guest = 2,
    supplier = 3
}

export enum OrderStatus{
    entered = 1,
    sent = 2,
    accepted = 3,
    rejected = 4,
    pickedUp = 5,
    delivered = 6,
    completed = 7
}

export enum NotificationType{
    BucketLiked =1,
}

export enum PushNotificationType{
    orderSent = 1,
    orderAccepted = 2,
    orderRejected = 3,
    orderPickupArriving = 4,
    orderPickedUp = 5,
    orderDelivered = 6,
}

export enum OwnershipType{
    user=3
}

export enum ProductType{
    stem = 1,
    pottedPlant = 2,
    tool = 3
}

export enum ImageType{
    icon = 1,
    thumbnail =2,
    small =3,
    medium = 4,
    large = 5,
    raw = 6
}

export enum AddressType{
    pickup = 1,
    business = 2,
    billing = 3,
}

export enum EmailType{
    pickup = 1,
    business = 2,
    billing = 3,
}

export enum ContactType{
    pickup = 1,
    business = 2,
    billing = 3,
}

export enum TeamMemberType{
    member =1,
    owner =2,
}

export enum PhoneType{
    pickup = 1,
    business = 2,
    billing = 3,
}

export enum PrimaryColor{
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
}

//Enum Parsing - Remember basically you really need to cast it as string for it to work. 
//var colorId = <string>myOtherObject.colorId; // Force string value here
//var color: Color = Color[colorId]; // Fixes lookup here.