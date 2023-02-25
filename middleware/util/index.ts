export function GetAPIUrl(){
    return is_server() ? process.env.API_URL :`${window.location.origin}/api/` ; 
}

export function GetAPIUrlWithPath(apiPath : string){
    return `${GetAPIUrl()}${apiPath}`;
}
export function GetAPIUrlWithPathAndID(apiPath:string, id:string|undefined){
    return `${GetAPIUrlWithPath(apiPath)}/${id}`;

}

export const POST_PROPERTIES = {
    method: 'POST',
    headers: {
        "Content-Type": "application/json",
    }
}

export const GET_PROPERTIES = {
    method: 'GET',
}

export const DELETE_PROPERTIES = {
    method: 'DELETE'
}

function is_server() {
    return ! (typeof window != 'undefined' && window.document);
}