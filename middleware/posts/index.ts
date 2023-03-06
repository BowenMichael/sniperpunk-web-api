import {IPostRecord} from "../../types";
import {DELETE_PROPERTIES, GET_PROPERTIES, PUT_PROPERTIES, GetAPIUrlWithPath, GetAPIUrlWithPathAndID, POST_PROPERTIES} from "../util";
const apiPath = 'posts';

export async function CreatePost(newPost : IPostRecord){
    return await (await fetch(GetAPIUrlWithPath(apiPath), {
        ...POST_PROPERTIES, 
            body: JSON.stringify(newPost)
    })).json() as IPostRecord;
}

export async function UpdatePost(newPost : IPostRecord){
    return await (await fetch(GetAPIUrlWithPathAndID(apiPath, String(newPost._id)), {
        ...PUT_PROPERTIES,
        body: JSON.stringify(newPost)
    })).json() as IPostRecord;
}

export async function GetPosts(){
    return await(await fetch(GetAPIUrlWithPath(apiPath), {
        ...GET_PROPERTIES,
    })).json() as IPostRecord[];
}

export async function DeletePost(post:IPostRecord)
{
    return ( await fetch(GetAPIUrlWithPathAndID(apiPath, post._id?.toString()), {
        ...DELETE_PROPERTIES
    }));
}