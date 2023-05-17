import {GET_PROPERTIES, GetAPIUrlWithPath, POST_PROPERTIES} from "../util";
import {IPostRecord} from "../../types";

const matchDataApiPath = 'match-data';
const matchDataByPlayerApiPath = 'match-data/by-player';

export async function GetMatchData(){
    return await(await fetch(GetAPIUrlWithPath(matchDataApiPath), {
        ...GET_PROPERTIES,
    })).json() as IPostRecord[];
}

export async function GetMatchsByName(playerName : string){
    return await(await fetch(GetAPIUrlWithPath(matchDataByPlayerApiPath), {
        ...POST_PROPERTIES,
        body : JSON.stringify({filter : {name : playerName}})
    })).json() as IPostRecord[];
}