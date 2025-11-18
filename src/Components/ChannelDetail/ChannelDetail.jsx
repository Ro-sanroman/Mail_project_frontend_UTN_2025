import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import useFetch from "../../hook/useFetch.jsx";
import { getMessagesByChannelId, createMessage } from "../../services/messagesService.js";
import "./ChannelDetail.css";

const ChannelDetail = () => {
    const { channel_id, workspace_id } = useParams();

    const { response, error, loading, sendRequest } = useFetch();
    const { response: postResponse, error: postError, loading: postLoading, sendRequest: sendPost } = useFetch();
    const [messageContent, setMessageContent] = useState("");

    function loadMessagesList() {
        sendRequest(async () => {
            return await getMessagesByChannelId(workspace_id, channel_id);
        });
    }

    useEffect(() => {
        if (workspace_id && channel_id) {
            console.log('[ChannelDetail] params:', { workspace_id, channel_id });
            loadMessagesList();
        }
    }, [workspace_id, channel_id]);

    useEffect(() => {
        if (postResponse && postResponse.ok) {
            setMessageContent("");
            loadMessagesList();
        }
    }, [postResponse]);

    // Log y extracción tolerante de mensajes
    if (response) {
        console.log('[ChannelDetail] response:', response);
    }
    const messages = Array.isArray(response?.data)
        ? response.data // cuando data ya es un array de mensajes
        : (response?.data?.messages || response?.messages || []);

    return (
        <div className="channel-detail">
            {!channel_id && <span>Canal no seleccionado</span>}

            {channel_id && (
                <>
                    {loading && <span>Cargando...</span>}
                    {error && <span>Error al cargar mensajes</span>}

                    {!loading && !error && (
                        <ul className="message-list">
                            {messages.map((m) => (
                                <li key={m._id || m.id} className="message-item">
                                    <span className="message-author">{m.author?.name || m.author || ""}</span>
                                    <span className="message-content">{m.content}</span>
                                </li>
                            ))}
                        </ul>
                    )}

                    <form
                        className="message-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (!messageContent.trim() || postLoading) return;
                            sendPost(async () => {
                                return await createMessage(workspace_id, channel_id, messageContent.trim());
                            });
                        }}
                    >
                        <input
                            type="text"
                            value={messageContent}
                            onChange={(e) => setMessageContent(e.target.value)}
                            placeholder="Escribe un mensaje"
                            className="message-input"
                        />
                        <button type="submit" disabled={postLoading} className="send-button">
                            {postLoading ? "Enviando..." : "Enviar"}
                        </button>
                        {postError && <span>Error al enviar mensaje</span>}
                    </form>
                </>
            )}
        </div>
    );
}
;

export default ChannelDetail;