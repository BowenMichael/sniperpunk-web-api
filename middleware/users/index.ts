import {IUserRecord} from "../../types";
import {GetAPIUrlWithPath, GetAPIUrlWithPathAndID, GET_PROPERTIES, PUT_PROPERTIES } from "../util";

export async function UpdateUser(user : IUserRecord){
    return await (await fetch(GetAPIUrlWithPathAndID('users', user.id),
        {
            ...PUT_PROPERTIES,
            body: JSON.stringify(user)
        }
    )).json();
}

export async function GetUserFromEmail(email : string){
    return await GetUsers().then(users => users.find((u : IUserRecord) => u.email === email));
}

export async function GetUsers(){
    return await (await fetch(GetAPIUrlWithPath('users')  ,
        {
            ...GET_PROPERTIES
        }
    )).json();
}

export async function GetUser(id : string){
    const res = await fetch(GetAPIUrlWithPathAndID('users', id)/*+ '?id=' + id*/,
        {
            ...GET_PROPERTIES
        }
    );
    //console.log({res : await res.json()})
    return (await res.json()) as IUserRecord;
}