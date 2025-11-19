import ENVIRONMENT from "../config/enviroment.js";
import { AUTH_TOKEN_KEY } from "../context/authContext.jsx";

//Obtiene la lista de canales
async function getChannelList (workspace_id){
    const response_http = await fetch(
        ENVIRONMENT.URL_API + `/api/workspace/${workspace_id}/channels`,
        {
            method: "GET",
            headers: {
                authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`,
            },
        }
    );
   
    const response = await response_http.json();
    console.log(response.ok)
     if (!response.ok) {
        throw new Error("Error at get channels");
    }
    return response;
}

//POST /api/workspace/:workspace_id/channels
//Crea un nuevo canal
//Debes pasar por body el name
//body example: {name: 'general'}
async function createChannel (workspace_id, channel_name){
    const url = ENVIRONMENT.URL_API + `/api/workspace/${workspace_id}/channels`;
    const body = { name: channel_name };
    const response_http = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`,
        },
        body: JSON.stringify(body),
    });
    let response;
    try {
        response = await response_http.json();
    } catch (e) {
        response = { ok: response_http.ok, status: response_http.status };
    }
    console.log('[channelService][POST] status:', response_http.status, 'response:', response);
    if (!response_http.ok || response?.ok === false) {
        throw new Error(response?.message || "Error al crear canal");
    }
    return response;
}

export { getChannelList, createChannel }