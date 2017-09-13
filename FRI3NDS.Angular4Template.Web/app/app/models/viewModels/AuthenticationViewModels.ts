﻿/* This class definitions are generated by Typewriter. Don't try to change it. 
//use this definition in order not to inherit classes:
//
//export class TokenInfo { 
//    public token: string;
//    public refreshToken: string;
//    public createdOn: Date;
//    public expiresOn: Date;
//    public tokenType: string;
//}
//export class RefreshTokenModel { 
//    public refreshToken: string;
//    public userId: number;
//}
//export class UserLoginModel { 
//    public login: string;
//    public password: string;
//    public email: string;
//}*/

export class TokenInfo {
public constructor(init?: Partial<TokenInfo>) {
        Object.assign(this, init);
    }
    public token: string;
    public refreshToken: string;
    public createdOn: Date;
    public expiresOn: Date;
    public tokenType: string;
}

export class RefreshTokenModel {
public constructor(init?: Partial<RefreshTokenModel>) {
        Object.assign(this, init);
    }
    public refreshToken: string;
    public userId: number;
}

export class UserLoginModel {
public constructor(init?: Partial<UserLoginModel>) {
        Object.assign(this, init);
    }
    public login: string;
    public password: string;
    public email: string;
}


