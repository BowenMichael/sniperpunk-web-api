/**
 * @description Functions for API Calls
 */
import {User} from "next-auth";

export interface ResponseFuncs {
    GET?: Function
    POST?: Function
    PUT?: Function
    DELETE?: Function
    FIND?: Function
}

export interface ICommonRecord {
    /**
     * @description Database ID
     */
    _id?: number,
}

/**
 * @description Player Information
 */
export interface PlayerRecord extends ICommonRecord {

    
    /**
     * @description Steam ID
     */
    steamId?: String,


    /**
     * @description Player name
     */
    gamertag?: String,

    /**
     * @description Date the player was created
     */
    created: Number
}

/**
 * @description Log information
 */
export interface ILogRecord {
    _id? : number,
    date? : number,
    tag : string,
    data? : {}
}

/**
 * @description Post system for ingame updates
 */
export interface IPostRecord extends ICommonRecord{
    name?:string,
    href?:string,
    postImage?: {data : string},
}

export interface IPlayerMatchRecord extends ICommonRecord{
    date?:number,
    name?:string,
    win?:boolean,
    endGameWeapon?:string,
    avgTimeToKill?:number,
    items?:[],
    
}

export interface IItemMatchRecord extends ICommonRecord{
    name?:string,
    pickRate?:number,
    avgTimeToKill?:number,
    stacks?:number,
}

export interface IUserRecord extends ICommonRecord {
    name : string,
    email : string,
    image? : string,
    emailVerified? : boolean,
    created? : number,
    role? : number,
}

export const roles = [
    { id : 0, desc : 'new' },
    { id : 1, desc : 'admin' },
    { id : 2, desc : 'read-only' },
]


