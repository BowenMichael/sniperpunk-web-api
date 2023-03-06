/**
 * @description Functions for API Calls
 */
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