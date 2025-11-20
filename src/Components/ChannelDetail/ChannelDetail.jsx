import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import useFetch from "../../hook/useFetch.jsx";
import {
  getMessagesByChannelId,
  createMessage,
} from "../../services/messagesService.js";
import "./ChannelDetail.css";

const ChannelDetail = () => {
  const { channel_id, workspace_id } = useParams();

  const { response, error, loading, sendRequest } = useFetch();
  const {
    response: postResponse,
    error: postError,
    loading: postLoading,
    sendRequest: sendPost,
  } = useFetch();
  const [messageContent, setMessageContent] = useState("");

  function loadMessagesList() {
    sendRequest(async () => {
      return await getMessagesByChannelId(workspace_id, channel_id);
    });
  }

  useEffect(() => {
    if (workspace_id && channel_id) {
      console.log("[ChannelDetail] params:", { workspace_id, channel_id });
      loadMessagesList();
    }
  }, [workspace_id, channel_id]);

  useEffect(() => {
    if (postResponse) {
      setMessageContent("");
      loadMessagesList();
    }
  }, [postResponse]);

  if (response) {
    console.log("[ChannelDetail] response:", response);
  }
  const messages = Array.isArray(response?.data)
    ? response.data
    : response?.data?.messages || response?.messages || [];

  return (
    <div className="channel-detail">
      {!channel_id && (
        <div className="no-channel-selected">
          <div className="no-channel-box">
            <div className="no-channel-icon">#</div>
            <h2 className="no-channel-title">Canal no seleccionado</h2>
            <p className="no-channel-subtitle">Elegí un canal en la barra lateral para ver los mensajes</p>
          </div>
        </div>
      )}

      {channel_id && (
        <>
          {loading && (
            <div className="loading-indicator fancy">
              <div className="spinner"/>
              <span>Cargando mensajes...</span>
            </div>
          )}
          {error && <span className="error-message">Error al cargar mensajes</span>}

          {!loading && !error && (
            messages.length === 0 ? (
              <div className="empty-messages">
                <div className="empty-icon">💬</div>
                <h3 className="empty-title">No hay mensajes aún</h3>
                <p className="empty-subtitle">¡Sé el primero en escribir!</p>
              </div>
            ) : (
            <ul className="message-list ">
  {messages.map((m) => {
    const author =
      m.user_name
      || m.author?.name
      || m.author?.username
      || m.author?.email
      || m.user?.name
      || m.user?.username
      || m.user?.email
      || m.member?.user?.name
      || m.member?.user?.username
      || m.member?.user?.email
      || m.member?.name
      || m.member?.username
      || m.member?.email
      || m.createdBy?.name
      || m.created_by?.name
      || m.sender?.name
      || m.sender?.username
      || m.sender
      || "Usuario";

    const content =
      m.message_content
      || m.content
      || m.message
      || m.msg
      || m.body
      || m.text
      || m.description
      || m.mensaje
      || m.contenido
      || m?.data?.content
      || m?.data?.message
      || m?.attributes?.content
      || m?.attributes?.message
      || (typeof m === "string" ? m : "");

    return (
    <div className="message-wrap">
      <div
        className={`message-author-row ${
          author === "Yo" || author === "Me" || author === "usuario" ? "me" : "other"
        }`}
      >
        <span className="message-author">{author}</span>
      </div>
      <li
        key={m._id || m.id}
        className={`message-item bubble ${
          author === "Yo" || author === "Me" || author === "usuario" ? "me" : "other"
        }`}
      >
        <span className="message-content">{content}</span>
      </li>
    </div>
    );
  })}
</ul>
            )
          )}

          <form
            className="message-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!messageContent.trim() || postLoading) return;
              sendPost(async () => {
                return await createMessage(
                  workspace_id,
                  channel_id,
                  messageContent.trim()
                );
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
            <button
              type="submit"
              disabled={postLoading}
              className="send-button"
            >
              {postLoading ? "Enviando..." : "Enviar"}
            </button>
            {postError && <span>Error al enviar mensaje</span>}
          </form>
        </>
      )}
    </div>
  );
};

export default ChannelDetail;
