import ENVIRONMENT from "../config/environment";
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

}

export { getChannelList, createChannel }