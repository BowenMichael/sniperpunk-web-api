

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

/**
 * @description Player Information
 */
export interface PlayerRecord {
    /**
     * @description Database ID
     */
    _id?: number,
    
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
