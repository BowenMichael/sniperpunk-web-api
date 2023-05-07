import {User} from "next-auth";
import {GetAPIUrlWithPathAndID, PUT_PROPERTIES } from "../util";

export async function UpdateUser(user : User){
    return await fetch(GetAPIUrlWithPathAndID('users', user.id),
        {
            ...PUT_PROPERTIES,
            body: JSON.stringify(user)
        }
    );
}