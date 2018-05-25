export interface IUser{
    _id?: string,
    email?: string,
    password?: string,
    firstName?: string,
    lastName?   : string,
    isEmailVerified?: boolean,
    facebookAuth?: object,
}