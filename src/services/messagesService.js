// GET /api/workspace/:workspace_id/channels/:channel_id/messages
// Obtener la lista de mensajes del backend
import ENVIRONMENT from "../config/enviroment.js";
import { AUTH_TOKEN_KEY } from "../context/authContext.jsx";

async function getMessagesByChannelId (workspace_id, channel_id) {
    const url = ENVIRONMENT.URL_API + `/api/workspace/${workspace_id}/channels/${channel_id}/messages`;
    console.log('[MessagesService][GET] url:', url, { workspace_id, channel_id });
    const response_http = await fetch(
        url,
        {
            method: "GET",
            headers: {
                authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`,
            },
        }
    );

    const response = await response_http.json();
    console.log('[MessagesService][GET] status:', response_http.status, 'response:', response);
    if (!response.ok) {
        throw new Error("Error al obtener mensajes del canal");
    }
    return response;
}

// POST /api/workspace/:workspace_id/channels/:channel_id/messages
// Crea un nuevo mensaje en un canal (body: { content })
async function createMessage (workspace_id, channel_id, content) {
    const body = { content };
    const url = ENVIRONMENT.URL_API + `/api/workspace/${workspace_id}/channels/${channel_id}/messages`;
    console.log('[MessagesService][POST] url:', url, { workspace_id, channel_id, body });
    const response_http = await fetch(
        url,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`,
            },
            body: JSON.stringify(body),
        }
    );

    const response = await response_http.json();
    console.log('[MessagesService][POST] status:', response_http.status, 'response:', response);
    if (!response.ok) {
        throw new Error(response.message || "Error al crear mensaje");
    }
    return response;
}


export {
    getMessagesByChannelId,
    createMessage
}